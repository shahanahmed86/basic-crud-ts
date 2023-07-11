import { Router } from 'express';
import * as TodosHandlers from './todos.handler';
import { Todo } from './todos.model';
import { validateRequest } from '../../middlewares';
import { ParamsWithId } from '../../interfaces/Validators';

const router = Router();

router
  .route('/')
  .get(TodosHandlers.findAll)
  .post(validateRequest({ body: Todo }), TodosHandlers.createOne);

router
  .route('/:id')
  .get(validateRequest({ params: ParamsWithId }), TodosHandlers.findOne)
  .put(validateRequest({ params: ParamsWithId, body: Todo }), TodosHandlers.updateOne)
  .delete(validateRequest({ params: ParamsWithId }), TodosHandlers.deleteOne);

export default router;