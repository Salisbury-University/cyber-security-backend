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
      config.app.node
        .concat(
          "/api2/json/nodes/",
          config.app.hostname,
          "/qemu/",
          vmid,
          "/clone?newid=",
          newId
        )
        .catch((error) => {
          // Fail to clone
        })
    );
  },
  /**
   * Checks the load by memory
   */
  selectNodeLoad(): any {
    return axios.get(config.app.node.concat("/api2/json/nodes")).then((res) => {
      let node: any = { node: res.data[0].node, mem: res.data[0].mem };
      // If node is greater than 1
      if (res.data.length > 1) {
        for (let i = 1; i < res.data.length; i++) {
          if (node.mem > res.data[i].mem) {
            node.node = res.data[i].node;
            node.mem = res.data[i].mem;
          }
        }
      }

      return node.node;
    });
  },
};
