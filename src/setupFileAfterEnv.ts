import { client } from './db';

global.afterAll(() => client.close());