import { NextFunction, Request, Response } from "express";
import { ExericseService } from "../../services/ExerciseService";

export const ExerciseController = {

getInfo(req: Request, res: Response, next: NextFunction) {
	try {
        const dat = ExericseService.getDisplay(req.params.id)
        res.send(dat);
    } catch (e) {
        return next(e);
    }

},


}