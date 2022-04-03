import { PrismaClient, VM } from ".prisma/client";
import axios from "axios";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  async checkPermission(id: string, user: JSON): Promise<VM> {
    const VM = await prisma.vM.findFirst({
      where: {
        vm: id,
      },
    });
    // Excercise does not exist
    if (VM == null)
      if (VM.user != user[0].uid)
        // Check if the vm is started by user
        // User permission
        // Note: Admin cannot be added yet until
        // Jwt code returns group/admin
        throw new UnauthorizedException();

    return VM;
  },

  async getVM(id: string, user: JSON): Promise<VM> {
    try {
      const VM = await this.checkPermission(id, user);
      return VM;
    } catch (e) {
      return e;
    }
  },
};
