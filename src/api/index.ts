import express from 'express';

import todosRoute from './todos/todos.routes';

const router = express.Router();

router.use('/todos', todosRoute);

export default router;
