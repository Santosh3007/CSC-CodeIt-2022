import express from 'express';
import IndexController from '../controllers/IndexController';

export default () => {
  const indexRouter = express.Router();
  const indexController = new IndexController();

  indexRouter.get('/', indexController.index);

  return indexRouter;
};
