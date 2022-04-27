import { Request, Response, NextFunction } from "express";
import { VirtualMachineService } from "../../services/VirtualMachineService";

export const ExcerciseController = {
  async requestVM(req: Request, res: Response, next: NextFunction) {
    try {
      VirtualMachineService.checkRunningVM(req.user[0].uid);
      VirtualMachineService.createVM(req.user[0].uid, String(req.params.id));
    } catch (e) {
      return next(e);
    }
  },
};
