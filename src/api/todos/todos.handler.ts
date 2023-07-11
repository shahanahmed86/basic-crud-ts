import { NextFunction, Request, Response } from 'express';
import { Todo, TodoWithId, Todos } from './todos.model';
import { ParamsWithId } from '../../interfaces/Validators';
import { ObjectId } from 'mongodb';

export async function findAll(_: Request, res: Response<TodoWithId[]>, next: NextFunction) {
  try {
    const result = await Todos.find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, TodoWithId, Todo>, res: Response, next: NextFunction) {
  try {
    const insertedResult = await Todos.insertOne(req.body);
    if (!insertedResult.acknowledged) throw new Error('Error inserting todo.');

    res.status(201).json({ ...req.body, _id: insertedResult.insertedId });
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request<ParamsWithId, TodoWithId>, res: Response, next: NextFunction) {
  try {
    const result = await Todos.findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found`);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, TodoWithId, Todo>, res: Response, next: NextFunction) {
  try {
    const result = await Todos.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found`);
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId>, res: Response, next: NextFunction) {
  try {
    const result = await Todos.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found`);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
