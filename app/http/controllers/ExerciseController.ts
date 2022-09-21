import { NextFunction, Request, Response } from "express";
import { ExerciseService } from "../../services/ExerciseService";

export const ExerciseController = {
  /**
   * Handles the fetchData request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   *
   */
  getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const saveData = ExerciseService.fetchData(
        req.params.exerciseID,
        req.params.id
      );
      res.send(saveData);
    } catch (e) {
      return next(e);
    }
  },

  /**
   * Handles the getStatus request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   *
   */
  getConst(req: Request, res: Response, next: NextFunction) {
    try {
      const saveStatus = ExerciseService.getStatus(
        req.params.uid,
        req.params.exerciseID
      );
    } catch (e) {
      return next(e);
    }
  },
};
