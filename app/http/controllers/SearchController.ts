import { NextFunction, Request, Response } from "express";
import { SearchService } from "../../services/SearchService";

export const SearchController = {
  /**
   * Handles the search request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   */
  async search(req: Request, res: Response, next: NextFunction) {
    res.send(SearchService.searchExercise(req.params.query));
  },
};
