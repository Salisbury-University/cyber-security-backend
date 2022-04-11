import { Request, Response, NextFunction } from "express";
import { VirtualMachineService } from "../../services/VirtualMachineService";

export const ExcerciseController = {
  async requestVM(req: Request, res: Response, next: NextFunction) {
    VirtualMachineService.checkRunningVM(req.user.uid);
  },
};
