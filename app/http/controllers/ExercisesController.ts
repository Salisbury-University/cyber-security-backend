import { Request, Response, NextFunction } from "express";
import UnprocessableEntityException from "../../exceptions/UnprocessableEntityException";
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
      res.send(ExercisesService.parseToJSON(ExercisesService.fetchList()));
    } catch (e) {
      return next(e);
    }
  },

  /**
   * Handles the fetching exercise list in pages request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   */
  fetchPage(req: Request, res: Response, next: NextFunction) {
    // Check params to be number
    if (isNaN(parseFloat(req.params.page))) {
      return next(new UnprocessableEntityException());
    }
    try {
      res.send(
        ExercisesService.parseToJSON(
          ExercisesService.fetchPage(req.params.page, req.body.pagination)
        )
      );
    } catch (e) {
      return next(e);
    }
  },
};
