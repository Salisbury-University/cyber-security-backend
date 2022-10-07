import { PrismaClient, VM } from ".prisma/client";
import { ExerciseService } from "./ExerciseService";
import axios from "axios";
import { marked } from "marked";
import fs, { unlink } from "fs";
import { config } from "../../config";
import InsufficientStorageException from "../exceptions/InsufficientStorageException";
import VirtualMachineConflitException from "../exceptions/VirtualMachineConflictException";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  /**
   * Checks if the user already has a VM running
   * and throw error if exists
   *
   * @param {string} user user currently logged in
   * @throw virtual machine conflict exception
   *
   * @return {Promise<void | VirtualMachineConflitException}
   * */
  async checkRunningVM(
    user: string
  ): Promise<void | VirtualMachineConflitException> {
    const VM = await prisma.vM.findFirst({
      where: {
        user: user,
      },
    });
    // Throw exception if VM exists in database
    if (VM != null) {
      throw new VirtualMachineConflitException();
    }
    return;
  },

  /**
   * checks the next lowest number to use for newId
   * All user vm are created from vmid 1000
   *
   * @param {number []} vmid array storing vmid
   * @return {number} newId to use for cloning
   */
  async assignNewVMID(exerciseId: string, user: string): Promise<number> {
    const VM = await prisma.vM.findMany({
      orderBy: {
        vmId: "asc",
      },
    });
    let newId = 1000;
    // Loop through the virtual machine and assign smallest number closest to 1000
    for (let i = 0; i < VM.length; i++) {
      if (parseInt(VM[i].vmId) == newId) {
        newId++;
      } else {
        break;
      }
    }
    const metadata: Object = ExerciseService.getMetadata(exerciseId);
    const endTime: Date = this.getVMEndTime(metadata["timelimit"]);

    // Create the to vmid so that it will be there
    await prisma.vM.create({
      data: {
        user: user,
        vmId: String(newId),
        node: "",
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

  /**
   * Creates the VM
   *
   * @param {string} user current user
   * @param {string} vmid vmid of vm
   * @return error from function
   */
  async createVM(user: string, vmid: string): Promise<JSON> {
    try {
      const load = this.selectNodeLoad(vmid);
      const newNode = load[0];
      const newId = load[1];
      this.cloneTemplate(vmid, newId);
      this.migrateTemplate(newId, newNode);
      this.startVM(newId, newNode);
      // Wait for 30 sec OS to boot for guest agent to run
      await new Promise((r) => setTimeout(r, 30000));
    } catch (e) {
      return e;
    }
  },

  /**
   * Starts the virtual machine
   *
   * @param {string} vmid id of vm
   * @param {string} node node where vm is located at
   */
  startVM(vmid: string, node: string) {
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
  migrateTemplate(newId: string, newNode: string): void {
    this.createAxiosWithToken()
      .post(
        config.app.node.concat(
          "/api2/json/nodes",
          config.app.node,
          "/qemu/",
          newId,
          "/migrate?target=",
          newNode
        )
      )
      .catch((error) => {
        // Throw error if fails to migrate
      });
  },

  /**
   * Clones the Template to current Node
   *
   * @param {string} vmid Virtual Machine ID
   * */
  cloneTemplate(vmid: string, newId: string): void {
    this.createAxiosWithToken()
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
      .catch((error) => {
        console.log(error);
      });
  },

  /**
   * Checks the load by VM running and
   *
   * @param {string} vmid number of vmid to clone
   * @return {string} return the node that the template should be cloned to
   */
  async selectNodeLoad(
    vmid: string,
    exerciseId: string,
    user: string
  ): string[] {
    // Gets the list of node (includes node name / cpu usage / disk avaliable)
    const node: string[] = [];
    const disk: number[] = [];
    const cpu: number[] = [];
    const vm: number[] = [];
    const vmId: number[] = [];

    this.createAxiosWithToken()
      .post(config.app.node.concat("/api2/json/nodes"))
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          node.push(res.data[i].node);
          // Calculate disk avaliable and push to array
          disk.push(res.data[i].maxdisk - res.data[i].disk);
          cpu.push(res.data[i].cpu);

          // Get vm running per node
          this.createAxiosWithToken()
            .post(
              config.app.node.concat(
                "/api2/json/nodes/",
                res.data[i].node,
                "/qemu"
              )
            )
            .then((res) => {
              vm.push(0);
              for (let j = 0; j < res.data.length; j++) {
                if (res.data[i].status === "running") {
                  vm[i]++;
                }
                if (res.data[i].vmid >= 1000) {
                  vmId.push(res.data[i].vmid);
                }
              }
            });
        }
      });

    // Get the new id
    const newId = await this.assignNewVMID(exerciseId, user);

    // Get the size of template
    const size = this.getSizeTemplate(vmid);

    // Check each node disk storage size to see if template can be clones
    // Otherwise remove it from the array
    for (let i = 0; i < disk.length; i++) {
      if (size > disk[i]) {
        disk.splice(i, 1);
        cpu.splice(i, 1);
        vm.splice(i, 1);
        node.splice(i, 1);
      }
    }

    // If no storage is free, send error
    if (disk.length < 1) {
      throw new InsufficientStorageException();
    }

    // Check least running vm or if all are the same
    let sameVM = true;
    let index = 0;
    for (let i = 1; i < vm.length; i++) {
      if (sameVM) {
        if (vm[index] != vm[i]) {
          sameVM = false;
        }
      }
      if (sameVM == false) {
        if (vm[index] > vm[i]) {
          index = i;
        }
      }
    }

    // If all the same number of running vm check by cpu usage
    if (sameVM) {
      for (let i = 1; cpu.length; i++) {
        if (cpu[index] > cpu[i]) {
          index = i;
        }
      }
    }

    // Return the name of the least node
    return [node[index], String(newId)];
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
          config.app.node,
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
};
