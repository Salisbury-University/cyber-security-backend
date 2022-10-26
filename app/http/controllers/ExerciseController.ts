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

  /**
   * Handles the fetchData request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   * @throws {VirtualMachineConflictException} File is Not found
   */
  async requestVM(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(
        await VirtualMachineService.createVM(
          req.body.uid,
          String(req.params.id),
          req.body.node
        )
      );
    } catch (e) {
      return next(e);
    }
  },
};
