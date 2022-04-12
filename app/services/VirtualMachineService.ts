import { PrismaClient, VM } from ".prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  checkTimeEnd(VMinfo: VM): boolean {
    if (VMinfo.timeEnd > new Date()) return false;
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
      }
    }
  },

  async createVM(user: string) {},

  checkConnection(user: string) {},

  cloneTemplate(vmid: number) {
    const load = this.checkNodeLoad();
    axios.post(
      server.concat("/api2/json/nodes/", load, "/qemu/", vmid, "/clone"),
      {
        newid: 200,
      }
    );
  },
  /**
   * Checks the load of each server
   */
  checkNodeLoad(): string {
    axios.post();
  },
};
