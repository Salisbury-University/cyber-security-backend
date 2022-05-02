import { NextFunction, Request, Response } from "express";
import { ExericseService } from "../../services/ExerciseService";

export const ExerciseController = {

async getInfo(req: Request, res: Response, next: NextFunction) {
	try {
        const dat = await ExericseService.findInfo(req.params.id, req.user.uid)
        res.send(dat);
    } catch (error) {
        return next(error);
    }

},


}