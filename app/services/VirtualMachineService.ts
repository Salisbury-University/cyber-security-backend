import { PrismaClient, VM } from ".prisma/client";
import { ExerciseService } from "./ExerciseService";
import axios from "axios";
import { config } from "../../config";
import InsufficientStorageException from "../exceptions/InsufficientStorageException";
import VirtualMachineConflictException from "../exceptions/VirtualMachineConflictException";

const prisma = new PrismaClient();

const minVMID = 400;
const maxVMID = 499;

export const VirtualMachineService = {
  /**
   * Creates the VM in proxmox
   *
   * @param {string} user current user
   * @param {string} exerciseId vmid of exercise
   * @param {string} nodeName node name to manual assign load
   * @return error from function
   */
  async createVM(
    user: string,
    exerciseId: string,
    nodeName: string = ""
  ): Promise<VM> {
    try {
      // Checks if the user already have vm running
      await this.checkRunningVM(user);

      const exerciseNode = await this.getNodeOfExercise(exerciseId);

      let newNode = "";
      let verified = false;

      // If nodeName is not empty then it is assigned from front end
      if (nodeName != "") {
        verified = this.verifyNode(nodeName);
      }

      if (verified) {
        // If verified, set the nodename to be the same
        newNode = nodeName;
      } else {
        // If not do load balancing
        newNode = await this.selectNodeLoad(exerciseId, exerciseNode);
      }

      const listOfVM = await this.getListofUsedVMID();

      // Assign new vmid depending on the current vm
      const vmPrisma = await this.assignNewVMID(
        exerciseId,
        user,
        newNode,
        listOfVM
      );

      const newId = String(vmPrisma.vmId);
      await this.cloneTemplate(exerciseId, exerciseNode, newId);

      if (newNode !== exerciseNode) {
        await this.migrateTemplate(newId, exerciseNode, newNode);
      }

      await this.startVM(newId, newNode);

      return vmPrisma;
    } catch (e) {
      return e;
    }
  },
  /**
   * Checks if the user already has a VM running
   * and throw error if exists
   *
   * @param {string} user user currently logged in
   * @throw virtual machine conflict exception
   *
   * @return {Promise<void | VirtualMachineConflictException>}
   * */
  async checkRunningVM(
    user: string
  ): Promise<void | VirtualMachineConflictException> {
    const VM = await prisma.vM.findFirst({
      where: {
        user: user,
      },
    });
    // Throw exception if vm is in running state
    if (VM !== null && VM.status === "running") {
      throw new VirtualMachineConflictException();
    }
    return;
  },

  /**
   * checks the next lowest number to use for newId
   * Min and Max are determined from global variable
   *
   * @param {string} exerciseId vmid for the exercise
   * @param {string} user userId of current user
   * @param {string} newLoad name of the node
   * @param {string []} listOfVM list of vm to avoid when assigning vmid
   * @return {string} newId to use for cloning
   */
  async assignNewVMID(
    exerciseId: string,
    user: string,
    newLoad: string,
    listOfVM: string[]
  ): Promise<VM> {
    let newId: number = minVMID;

    // Find the list number of VMID without range
    for (let i = minVMID; i <= maxVMID; i++) {
      const found = listOfVM.find((element) => element === String(i));
      if (found === undefined) {
        newId = i;
        break;
      }
    }

    // Get the end time of the vmid
    const metadata: Object = ExerciseService.getMetaData(exerciseId);
    const endTime: Date = this.getVMEndTime(metadata["timelimit"]);

    const stringId = String(newId);

    // Check if it already exist
    const vmUser = await prisma.vM.findFirst({
      where: {
        user: user,
        exerciseId: exerciseId,
      },
    });
    if (vmUser === null) {
      // Create the to vmid so that it will be there
      return await prisma.vM.create({
        data: {
          user: user,
          vmId: stringId,
          node: newLoad,
          exerciseId: exerciseId,
          ip: "",
          port: "",
          timeLimit: metadata["timelimit"],
          timeEnd: endTime,
          status: "running",
        },
      });
    } else {
      return await prisma.vM.update({
        where: {
          user_exerciseId: {
            user: user,
            exerciseId: exerciseId,
          },
        },
        data: {
          user: user,
          vmId: stringId,
          node: newLoad,
          exerciseId: exerciseId,
          ip: "",
          port: "",
          timeLimit: metadata["timelimit"],
          timeEnd: endTime,
          status: "running",
        },
      });
    }
  },

  /**
   * Get the endtime of exercise
   *
   * @param {string} timeLimit Timelimit in xxhxxmxxs
   * @returns {Date} Get epoch end time
   */
  getVMEndTime(timeLimit: string): Date {
    const lowerCaseTime = timeLimit.toLowerCase();
    let hours = 0,
      mins = 0,
      secs = 0;
    let splitHours, splitMin, splitSec;
    splitHours = timeLimit.split("h");

    if (splitHours.length == 2) {
      hours = parseFloat(splitHours[0]);
      splitMin = splitHours[1].split("m");
    } else {
      splitMin = timeLimit.split("m");
    }

    if (splitMin.length == 2) {
      mins = parseFloat(splitMin[0]);
      splitSec = splitMin[1].split("s");
    } else {
      splitSec = timeLimit.split("s");
    }

    if (splitSec.length == 2) {
      secs = parseFloat(splitSec[0]);
    }
    const currTime = new Date().getTime();
    const endTime = new Date(currTime + (hours * 60 * 60 + mins * 60 + secs));
    return endTime;
  },

  /**
   * Starts the virtual machine
   *
   * @param {string} vmid id of vm
   * @param {string} node node where vm is located at
   */
  startVM(vmid: string, node: string): void {
    this.createAxiosWithToken().post(
      config.app.nodeUrl.concat(
        "/api2/json/nodes/",
        node,
        "/qemu/",
        vmid,
        "/status/start"
      )
    );
  },

  /**
   * Migrates virtual machine to newNode
   *
   * @param {string} newId Id of newly created virtual machine
   * @throw Error during migration
   * */
  async migrateTemplate(
    newId: string,
    exerciseNode: string,
    newNode: string
  ): Promise<void> {
    // Migrate the vm to new node
    await this.createAxiosWithToken()
      .post(
        config.app.nodeUrl.concat(
          "/api2/json/nodes/",
          exerciseNode,
          "/qemu/",
          newId,
          "/migrate?target=",
          newNode
        )
      )
      .then(async (res) => {
        // Get the upid of process
        const upid = res.data.data;
        await this.waitForProcess(upid, exerciseNode);
      });
  },

  /**
   * Clones virtual machine template
   *
   * @param {string} vmid virtual machine id
   * @param {string} exerciseNode Node where the exercise exist
   * @param {string} newId new virtual machine id
   * @returns {string} exercise Id on success
   */
  async cloneTemplate(
    vmid: string,
    exerciseNode: string,
    newId: string
  ): Promise<string> {
    // This part clones the exercise vm to newid
    await this.createAxiosWithToken()
      .post(
        config.app.nodeUrl.concat(
          "/api2/json/nodes/",
          exerciseNode,
          "/qemu/",
          vmid,
          "/clone",
          "?full=1",
          "&newid=",
          newId
        )
      )
      .then(async (res) => {
        const upid = res.data.data;
        await this.waitForProcess(upid, exerciseNode);
      });

    return newId;
  },

  /**
   * Checks for load of each node and determine based on:
   * Disk size, VM running, CPU, ram
   *
   * @param {string} exerciseId vmid of exercise Id
   * @return {string} return the node that the template should be cloned to
   */
  async selectNodeLoad(
    exerciseId: string,
    exerciseNode: string
  ): Promise<string> {
    // Gets the list of node (includes node name / cpu usage / disk avaliable)
    const node: object = [];

    const ListOfNodes = await this.getListofNodes();
    for (let i = 0; i < ListOfNodes.length; i++) {
      const currNode = ListOfNodes[i].node;
      const currDisk = ListOfNodes[i].maxdisk - ListOfNodes[i].disk;
      const currCPU = ListOfNodes[i].cpu;

      const currVM: string[] = await this.getListOfRunningVM(
        ListOfNodes[i].node
      );
      for (let i = 0; i < currVM.length; i++) {}
      node[i] = {
        node: currNode,
        disk: currDisk,
        cpu: currCPU,
        vm: currVM,
      };
    }

    // Get the size of template
    const size = await this.getSizeTemplate(exerciseId, exerciseNode);

    // Since node is object, it does not have length
    let keys = Object.keys(node);

    // Check each node disk storage size to see if template can be clones
    // Otherwise remove it from the array
    for (let i = 0; i < keys.length; i++) {
      if (size > node[i].disk) {
        delete node[i];
      }
    }

    // Update the keys after if node was deleted
    keys = Object.keys(node);

    // If no storage is free, send error
    if (keys.length < 1) {
      throw new InsufficientStorageException();
    }

    // Check if the same number of VM's are running on each node
    // If same, it needs to be checked against CPU usage
    let sameNumVMRunning = true;
    let balanceNodeIndex = 0;
    for (let i = 1; i < keys.length; i++) {
      if (sameNumVMRunning == false) {
        if (node[balanceNodeIndex].vm.length > node[i].vm.length) {
          balanceNodeIndex = i;
        }
      } else {
        if (node[balanceNodeIndex].vm.length != node[i].vm.length) {
          sameNumVMRunning = false;
        }
      }
    }

    // If all the same number of running vm check by cpu usage
    if (sameNumVMRunning) {
      for (let i = 1; i < Object.keys(node).length; i++) {
        if (node[balanceNodeIndex].cpu > node[i].cpu) {
          balanceNodeIndex = i;
        }
      }
    }

    // Return the name of the least node and list of virtual machine
    return node[balanceNodeIndex].node;
  },

  /**
   * Gets the disk size of template
   *
   * @param {string} vmid The vmid of template
   * @return {any} size of the template
   */
  async getSizeTemplate(vmid: string, nodeName: string): Promise<Number> {
    return await this.createAxiosWithToken()
      .get(
        config.app.nodeUrl.concat(
          "/api2/json/nodes/",
          nodeName,
          "/qemu/",
          vmid,
          "/config"
        )
      )
      .then((res) => {
        const data = res.data.data;
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          // Check if the the key starts with ide or scsi
          if (key.includes("ide") || key.includes("scsi")) {
            const split = data[key].split("size=");
            if (split.length > 2) {
              continue;
            } else {
              // Last letter is G (gigabyte): hit the jackpot
              const lastLetter = split[1].length - 1;
              if (split[1][lastLetter] == "G") {
                const stringSize = split[1].substring(0, lastLetter);
                return Number(stringSize) * Math.pow(2, 30) * 8;
              }
            }
          }
        }
      });
  },

  /**
   * Creates axios instance with token for ease of use
   */
  createAxiosWithToken(): any {
    return axios.create({
      headers: {
        Authorization: config.app.token,
      },
    });
  },

  /**
   * Get list of node information from proxmox
   *
   * @returns {Object} returns node information of cluster
   */
  async getListofNodes(): Promise<any> {
    return await this.createAxiosWithToken()
      .get(config.app.nodeUrl.concat("/api2/json/nodes"))
      .then((res) => {
        return res.data.data;
      });
  },

  /**
   * Gets the list of vm across the cluster
   *
   * @returns {string []} Returns list of vm
   */
  async getListofUsedVMID(): Promise<string[]> {
    let listVM: string[] = [];

    // Get list of nodes in cluster
    const nodes = await this.getListofNodes();
    // Per nodes get list of vm
    for (let i = 0; i < nodes.length; i++) {
      // Get list of vm of particular node
      listVM = [...listVM, ...(await this.getListOfVMInNode(nodes[i].node))];
    }
    return listVM;
  },

  /**
   * Gets list of VM and container in particular node
   *
   * @param {string} node nodename of promox
   * @returns return from api call
   */
  async getListOfVMInNode(node: string): Promise<any> {
    const listVM = [];
    await this.createAxiosWithToken()
      .get(config.app.nodeUrl.concat("/api2/json/nodes/", node, "/qemu"))
      .then((res) => {
        const data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          listVM.push(String(data[i].vmid));
        }
      });

    // Get list of container in particular node
    await this.createAxiosWithToken()
      .get(config.app.nodeUrl.concat("/api2/json/nodes/", node, "/lxc"))
      .then((res) => {
        const data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          listVM.push(String(data[i].vmid));
        }
      });
    return listVM;
  },

  /**
   * Gets the node where the exercise is located at
   *
   * @param {string} exerciseId Id of the exercise
   * @returns
   */
  async getNodeOfExercise(exerciseId: string): Promise<string> {
    const nodes = await this.getListofNodes();

    let exerciseNode = "";
    // Finds which node current has the vmid number equal to exerciseId
    for (let i = 0; i < nodes.length; i++) {
      const currNode = nodes[i].node;
      const listOfVM = await this.getListOfVMInNode(currNode);
      for (let j = 0; j < listOfVM.length; j++) {
        if (listOfVM[j] === exerciseId) {
          return currNode;
        }
      }
    }
  },
  /**
   * Gets current running vmid of particular node
   *
   * @param {string} node proxmox node name
   * @returns Array of vmid
   */
  async getListOfRunningVM(node: string): Promise<any> {
    const listVM = [];
    await this.createAxiosWithToken()
      .get(config.app.nodeUrl.concat("/api2/json/nodes/", node, "/qemu"))
      .then((res) => {
        const data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].status == "running") listVM.push(data[i].vmid);
        }
      });
    return listVM;
  },

  /**
   *
   *
   * @param {string} upid the unique process id
   * @param {string} node node where the process is being used
   */
  async waitForProcess(upid: string, node: string): Promise<void> {
    while (true) {
      const loopProcess = await this.createAxiosWithToken()
        .get(
          config.app.nodeUrl.concat(
            "/api2/json/nodes/",
            node,
            "/tasks/",
            upid,
            "/status"
          )
        )
        .then(async (res) => {
          const data = res.data.data;
          return data.status === "stopped" ? false : true;
        });
      if (loopProcess == false) {
        break;
      }
      // Wait for 1 second before looping
      await new Promise((r) => setTimeout(r, 1000));
    }
    await new Promise((r) => setTimeout(r, 3000));
  },

  /**
   * Force stop the running VM
   *
   * @param {string} vmid vmid of VM
   * @param {string} node node where the vm is stored
   */
  stopVM(vmid: string, node: string): void {
    this.createAxiosWithToken().post(
      config.app.nodeUrl.concat(
        "/api2/json/",
        node,
        "/qemu/",
        vmid,
        "/status/stop"
      )
    );
  },

  /**
   * Delete the VM
   *
   * @param {string} vmid vmid of VM
   * @param {string} node node where the vm is stored
   */
  unlinkVM(vmid: string, node: string): void {
    this.createAxiosWithToken()
      .put(
        config.app.nodeUrl.concat(
          "/api2/json/",
          node,
          "/qemu/",
          vmid,
          "/unlink?force=true"
        )
      )
      .catch((error) => {});
  },

  /**
   * Verify that the node is in the whitelist of nodes
   *
   * @param {string} node   - Node from the user
   * @returns {boolean}     - Returns true if it is in whitelist otherwise return false
   */
  verifyNode(node: string): boolean {
    config.app.anton.array.forEach((element) => {
      if (element === node) {
        return true;
      }
    });
    return false;
  },
};
