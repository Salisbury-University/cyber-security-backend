import { NextFunction, Request, Response } from "express";
import { ExerciseService } from "../../services/ExerciseService";
import { VirtualMachineService } from "../../services/VirtualMachineService";

export const ExerciseController = {
  /**
   * Handles the fetchData request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   * @throws {NotFoundException} File is Not found
   */
  getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const dat = ExerciseService.fetchData(req.params.id);
      res.send(dat);
    } catch (e) {
      return next(e);
    }
  },
  async requestVM(req: Request, res: Response, next: NextFunction) {
    try {
      VirtualMachineService.checkRunningVM(req.user[0].uid);
      VirtualMachineService.createVM(req.user[0].uid, String(req.params.id));
    } catch (e) {
      return next(e);
    }
  },
};
