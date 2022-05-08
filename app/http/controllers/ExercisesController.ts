import { Request, Response, NextFunction } from "express";
import { ExercisesService } from "../../services/ExercisesService";

export const ExercisesController = {
  /**
   * Handles the fetching exercise list request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   */
  fetchList(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(ExercisesService.fetchList());
    } catch (e) {
      return next(e);
    }
  },
};
