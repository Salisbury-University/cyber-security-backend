import { PrismaClient, VM } from ".prisma/client";
import axios from "axios";
import { config } from "../../config";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  /**
   * Check if VM timeEnd with current time
   *
   * @param {VM} VM virtual machine databse for currently running
   * @return {boolean} returns true if the time is earlier than current time
   */
  checkTimeEnd(VMinfo: VM): boolean {
    if (VMinfo.timeEnd < new Date()) return false;
    return true;
  },

  /**
   * Checks if the user already has a VM running
   * Terminates if time ended
   *
   * @param {string} user user currently logged in
   * @throw {} Error on already existing VM
   * */
  async checkRunningVM(user: string): Promise<void> {
    const VM = await prisma.vM.findFirst({
      where: {
        user: user,
      },
    });
    // VM data is stored or running
    if (VM != null) {
      // Double checking and terminating if VM is running
      if (this.checkTimeEnd(VM)) {
        //Terminate the VM
      } else {
        //Throw error
      }
    }
  },

  async createVM(user: string, vmid: string) {
    try {
      this.checkRunningVM(user);
      this.cloneTemplate(vmid);
    } catch (e) {
      return e;
    }
  },

  /**
   * Migrates virtual machine to newNode
   *
   * @param {string} newId Id of newly created virtual machine
   * @throw {} Error during migration
   * */
  migrateTemplate(newId: string, newNode: string): void {
    axios
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
  cloneTemplate(vmid: string): void {
    const load = this.selectNodeLoad();
    //Currently the newid is set but it will be changed
    const newId = "1000";
    axios.post(
      config.app.node.concat(
        "/api2/json/nodes/",
        config.app.hostname,
        "/qemu/",
        vmid,
        "/clone?newid=",
        newId
      )
    );
  },

  /**
   * Checks the load by VM running and
   *
   * @param {string} vmid number of vmid to clone
   * @return {string} return the node that the template should be cloned to
   */
  selectNodeLoad(vmid: string): string {
    // Gets the list of node (includes node name / cpu usage / disk avaliable)
    const node: string[] = [];
    const disk: number[] = [];
    const cpu: number[] = [];
    const vm: number[] = [];

    axios.post(config.app.node.concat("/api2/json/nodes")).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        node.push(res.data[i].node);
        // Calculate disk avaliable and push to array
        disk.push(res.data[i].maxdisk - res.data[i].disk);
        cpu.push(res.data[i].cpu);

        // Get vm running per node (maybe make this into function passing node info)
        axios
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
            }
          });
      }
    });

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
    }

    // Check least running vm
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

    return node[index];
  },

  /**
   * Gets the disk size of template
   *
   * @param {string} vmid The vmid of template
   * @return {any} size of the template
   */
  getSizeTemplate(vmid: string): any {
    return axios
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
        for (let i = 0; i < res.data.length; i++) {}
      });
  },
};
