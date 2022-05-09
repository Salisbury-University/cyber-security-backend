import { NextFunction, Request, Response } from "express";
import { ExericseService } from "../../services/ExerciseService";

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
            const dat = ExericseService.fetchData(req.params.id)
            res.send(dat);
        } catch (e) {
            return next(e);
        }

    },


}