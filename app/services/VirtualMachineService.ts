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
  ): Promise<void> {
    try {
      let newNode = "";
      let listOfVM = [];

      if (nodeName != "") {
        newNode = nodeName;
        listOfVM = this.getListofVM();
      } else {
        const load = this.selectNodeLoad(exerciseId);
        newNode = load[0];
        listOfVM = load[1];
      }

      // Assign new vmid depending on the current vm
      const newId = await this.assignNewVMID(
        exerciseId,
        user,
        newNode,
        listOfVM
      );
      this.cloneTemplate(exerciseId, newId);

      if (newNode !== config.app.nodename) {
        this.migrateTemplate(newId, newNode);
      }

      this.startVM(newId, newNode);
      // Wait for 30 sec OS to boot for guest agent to run
      // await new Promise((r) => setTimeout(r, 30000));
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
   * @return {Promise<void | VirtualMachineConflictException}
   * */
  async checkRunningVM(
    user: string
  ): Promise<void | VirtualMachineConflictException> {
    const VM = await prisma.vM.findFirst({
      where: {
        user: user,
      },
    });
    // Throw exception if VM exists in database
    if (VM != null) {
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
   * @return {number} newId to use for cloning
   */
  async assignNewVMID(
    exerciseId: string,
    user: string,
    newLoad: string,
    listOfVM: string[]
  ): Promise<number> {
    let newId: number = minVMID;

    // Find the list number of VMID without range
    for (let i = minVMID; i <= maxVMID; i++) {
      const found = listOfVM.find((element) => i);
      if (found === undefined) {
        newId = i;
        break;
      }
    }

    // Get the end time of the vmid
    const metadata: Object = ExerciseService.getMetadata(exerciseId);
    const endTime: Date = this.getVMEndTime(metadata["timelimit"]);

    // Create the to vmid so that it will be there
    await prisma.vM.create({
      data: {
        user: user,
        vmId: String(newId),
        node: newLoad,
        exerciseId: exerciseId,
        ip: "",
        port: "",
        timeLimit: metadata["timelimit"],
        timeEnd: endTime,
      },
    });
    return newId;
  },

  /**
   * Get the endtime of exercise
   *
   * @param {string} timeLimit Timelimit in xxhxxmxxs
   * @returns {Date}
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
      config.app.node.concat(
        "/api2/json/",
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
  async migrateTemplate(newId: string, newNode: string): Promise<void> {
    // Migrate the vm to new node
    await this.createAxiosWithToken()
      .post(
        config.app.node.concat(
          "/api2/json/nodes",
          config.app.nodename,
          "/qemu/",
          newId,
          "/migrate?target=",
          newNode
        )
      )
      .then((res) => {
        // Get the upid of process
        this.createAxiosWithToken()
          .post(
            config.app.node.concat(
              "/api2/json/nodes/",
              newNode,
              "/tasks",
              "?vmid=",
              newId
            )
          )
          .then(async (res) => {
            // Get status of migration process
            // Loop until status become stopped
            const upid = res.data.upid;
            let loop_process = true;
            while (loop_process) {
              this.createAxiosWithToken()
                .post(
                  config.app.node.concat(
                    "/api2/json/nodes/",
                    newNode,
                    "/tasks/",
                    upid,
                    "/status"
                  )
                )
                .then((res) => {
                  if (res.data.status === "stopped") {
                    loop_process = false;
                  }
                });
              // Wait for 1 second before looping
              await new Promise((r) => setTimeout(r, 1000));
            }
          });
      });
  },

  /**
   * Clones the Template to current Node
   *
   * @param {string} vmid Virtual Machine ID
   * */
  async cloneTemplate(vmid: string, newId: string): Promise<void> {
    // This part clones the exercise vm to newid
    await this.createAxiosWithToken()
      .post(
        config.app.node.concat(
          "/api2/json/nodes/",
          config.app.nodename,
          "/qemu/",
          vmid,
          "/clone?newid=",
          newId
        )
      )
      .then(async (res) => {
        // Get the upid of process
        this.createAxiosWithToken()
          .post(
            config.app.node.concat(
              "/api2/json/nodes/",
              config.app.nodename,
              "/tasks",
              "?vmid=",
              newId
            )
          )
          .then(async (res) => {
            // Get status of migration process
            // Loop until status become stopped
            const upid = res.data.upid;
            let loop_process = true;
            while (loop_process) {
              this.createAxiosWithToken()
                .post(
                  config.app.node.concat(
                    "/api2/json/nodes/",
                    config.app.nodename,
                    "/tasks/",
                    upid,
                    "/status"
                  )
                )
                .then((res) => {
                  if (res.data.status === "stopped") {
                    loop_process = false;
                  }
                });
              // Wait for 1 second before looping
              await new Promise((r) => setTimeout(r, 1000));
            }
          });
      });
  },

  /**
   * Checks for load of each node and determine based on:
   * Disk size, VM running, CPU, ram
   *
   * @param {string} exerciseId vmid of exercise Id
   * @return {string} return the node that the template should be cloned to
   */
  async selectNodeLoad(exerciseId: string): Promise<Object> {
    // Gets the list of node (includes node name / cpu usage / disk avaliable)
    const node: object = [];
    // This vm will be used for assigning new vmid so that it avoids vmid from
    //both the database and the ones that are already in the system
    const vm: string[] = [];

    const axiosNode = this.getListofNodes();
    for (let i = 0; i < axiosNode.length; i++) {
      const currNode = axiosNode[i].node;
      const currDisk = axiosNode[i].maxdisk - axiosNode[i].disk;
      const currCPU = axiosNode[i].cpu;

      const currVM: string[] = this.getListofVM(axiosNode[i].node);
      for (let i = 0; i < currVM.length; i++) {
        vm.push(currVM[i]);
      }
      node[i] = {
        node: currNode,
        disk: currDisk,
        cpu: currCPU,
        vm: currVM,
      };
    }

    // Get the size of template
    const size = this.getSizeTemplate(exerciseId);

    // Check each node disk storage size to see if template can be clones
    // Otherwise remove it from the array
    for (let i = 0; i < Object.keys(node).length; i++) {
      if (size > node[i].disk) {
        delete node[i];
      }
    }

    // If no storage is free, send error
    if (Object.keys(node).length < 1) {
      throw new InsufficientStorageException();
    }

    // Check if the same number of VM's are running on each node
    // If same, it needs to be checked against CPU usage
    let sameNumVMRunning = true;
    let balanceNodeIndex = 0;
    for (let i = 1; i < Object.keys(node).length; i++) {
      if (sameNumVMRunning == false) {
        if (node[balanceNodeIndex].vm.length > node[i].vm.length) {
          balanceNodeIndex = i;
        }
      }
      if (sameNumVMRunning) {
        if (node[balanceNodeIndex].vm.length != node[i].vm.length) {
          sameNumVMRunning = false;
        }
      }
    }

    // If all the same number of running vm check by cpu usage
    if (sameNumVMRunning) {
      for (let i = 1; Object.keys(node).length; i++) {
        if (node[balanceNodeIndex].cpu > node[i].cpu) {
          balanceNodeIndex = i;
        }
      }
    }

    // Return the name of the least node and list of virtual machine
    return [node[balanceNodeIndex].node, vm];
  },

  /**
   * Gets the disk size of template
   *
   * @param {string} vmid The vmid of template
   * @return {any} size of the template
   */
  getSizeTemplate(vmid: string): any {
    return this.createAxiosWithToken()
      .post(
        config.app.node.concat(
          "/api2/json/nodes/",
          config.app.nodename,
          "/qemu/",
          vmid,
          "config"
        )
      )
      .then((res) => {
        for (var key in res.data) {
          //Checks for ide 0-3 scsi 0-30
          if (key.includes("ide") || key.includes("scsi")) {
            const split = res.data[key].split("size=");
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
  getListofNodes(): Object {
    let node: Object = null;
    this.createAxiosWithToken()
      .post(config.app.node.concat("/api2/json/nodes"))
      .then((res) => {
        node = res.data;
      });
    return node;
  },

  /**
   * Gets the list of vm across the cluster
   *
   * @returns {string []} Returns list of vm
   */
  getListofVM(): string[] {
    const listVM: string[] = [];

    // Get list of nodes in cluster
    const nodes = this.getListofNodes();

    // Per nodes get list of vm
    for (let i = 0; i < nodes.length; i++) {
      // Get list of vm of particular node
      this.createAxiosWithToken()
        .post(
          config.app.node.concat("/api2/json/nodes", nodes[i].node, "/qemu")
        )
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            listVM.push(res.data[i].vmid);
          }
        });
    }

    return listVM;
  },

  /**
   * Force stop the running VM
   *
   * @param {string} vmid vmid of VM
   * @param {string} node node where the vm is stored
   */
  stopVM(vmid: string, node: string): void {
    this.createAxiosWithToken().post(
      config.app.node.concat(
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
        config.app.node.concat(
          "/api2/json/",
          node,
          "/qemu/",
          vmid,
          "/unlink?force=true"
        )
      )
      .catch((error) => {});
  },
};
