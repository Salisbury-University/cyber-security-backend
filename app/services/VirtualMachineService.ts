import { PrismaClient, VM } from ".prisma/client";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import NotFoundException from "../exceptions/NotFound";

const prisma = new PrismaClient();

export const VirtualMachineService = {
  async checkPermission(id: string, user: string): Promise<VM> {
    const VM = await prisma.vM.findFirst({
      where: {
        vm: id,
      },
    });
    // Excercise does not exist
    if (VM == null) throw new NotFoundException();

    // Check if the vm is started by user
    // User permission
    // Note: Admin cannot be added yet until
    // Jwt code returns group/admin
    if (VM.user != user) throw new UnauthorizedException();

    return VM;
  },

  async getVM(id: string, user: string): Promise<VM> {
    try {
      const VM = await this.checkPermission(id, user);
      return VM;
    } catch (e) {
      return e;
    }
  },
};
