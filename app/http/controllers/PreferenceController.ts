import { Request, Response, NextFunction } from "express";
import { PreferenceService } from "../../services/PreferenceService";

export const PreferenceController = {
  /**
   * Update the preference database
   *
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @param {NextFunction} next Express NextFunction (used for middleware)
   */
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      res.send(await PreferenceService.update(req.user.uid, req.body));
    } catch (e) {
      return next(e);
    }
  },

  /**
   * Get or create new database
   *
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @param {NextFunction} next Express NextFunction (used for middleware)
   */
  async get(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    res.send(await PreferenceService.getCreatePreference(req.user.uid));

    return next();
  },
};
