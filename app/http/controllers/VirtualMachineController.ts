import { NextFunction, Request, Response } from "express";
import { VirtualMachineService } from "../../services/VirtualMachineService";

export const VirtualMachineController = {
  async terminate(req: Request, res: Response, next: NextFunction) {
    try {
      await VirtualMachineService.DeleteVM(req.user.uid, req.params.id);
    } catch (e) {
      return next(e);
    }
  },

  async getVM(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(await VirtualMachineService.getVM(req.user.uid));
    } catch (e) {
      return next(e);
    }
  },
};
