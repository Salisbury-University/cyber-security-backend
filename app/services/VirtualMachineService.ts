import { PrismaClient, VM } from ".prisma/client";
import axios from "axios";
import { config } from "../../config";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  /**
   * Check if VM timeEnd with current time
   *
   * @param {VM} VM virtual machine databse for currently running
   * @returns
   */
  checkTimeEnd(VMinfo: VM): boolean {
    if (VMinfo.timeEnd < new Date()) return false;
    return true;
  },

  async checkRunningVM(user: string) {
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

  async createVM(user: string) {},

  cloneTemplate(vmid: string) {
    const load = this.selectNodeLoad();
    //Currently the newid is set but it will be changed
    const newid = "1000";
    axios.post(
      config.app.node.concat(
        "/api2/json/nodes/",
        load,
        "/qemu/",
        vmid,
        "/clone?newid=",
        newid
      )
    );
  },
  /**
   * Checks the load by memory
   */
  selectNodeLoad(): any {
    return axios
      .post(config.app.node.concat("/api2/json/nodes"))
      .then((res) => {
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
