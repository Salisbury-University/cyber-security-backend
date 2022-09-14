import { NextFunction, Request, Response } from "express";
import { ExerciseService } from "../../services/ExerciseService";

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
      const dat = ExerciseService.fetchData(
        req.params.exerciseID,
        req.params.id
      );
      res.send(dat);
    } catch (e) {
      return next(e);
    }
  },

  getConst(req: Request, res: Response, next: NextFunction) {
    try {
      const dat = ExerciseService.getStatus(
        req.params.uid,
        req.params.exerciseID
      );
    } catch (e) {
      return next(e);
    }
  },
};
