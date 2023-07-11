import { ObjectId } from 'mongodb';
import * as z from 'zod';

export interface RequestValidator {
  params?: z.AnyZodObject,
  body?: z.AnyZodObject,
  query?: z.AnyZodObject,
}

export const ParamsWithId = z.object({
  id: z.string().refine((val) => {
    try {
      return new ObjectId(val);
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid ObjectId',
  }),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
