import {NextFunction, Request, Response} from 'express';

export default class IndexController {
  public async index(_: Request, res: Response, next: NextFunction) {
    try {
      res.json({message: 'TypeScript + Express Server'});
    } catch (e) {
      res.status(400);
      res.json({message: 'Error'});
      next(e);
    }
  }
}
