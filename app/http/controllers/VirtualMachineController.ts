import { Request, Response, NextFunction } from "express";
import { VirtualMachineService } from "../../services/VirtualMachineService";

export const VirtualMachineController = {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getVM(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(
        await VirtualMachineService.getVM(req.params["id"], req.user.u_id)
      );
    } catch (e) {
      return next(e);
    }
  },
};
