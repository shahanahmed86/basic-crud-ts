import { MongoClient } from 'mongodb';

const { MONGO_URI = 'mongodb://root:example@localhost:27017' }  = process.env;

export const client = new MongoClient(MONGO_URI);

export const db = client.db();

