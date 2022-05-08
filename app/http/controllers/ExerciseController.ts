import { NextFunction, Request, Response } from "express";
import { ExericseService } from "../../services/ExerciseService";

export const ExerciseController = {
    /**
* Calls Function get Display and passes in ID
*
* @param {string} message
* @return {string} the message passed in
*/
    getInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const dat = ExericseService.getDisplay(req.params.id)
            res.send(dat);
        } catch (e) {
            return next(e);
        }

    },


}