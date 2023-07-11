import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';
import { ObjectId } from 'mongodb';

const BASE_ROUTE = '/api/v1/todos';

describe(`GET ${BASE_ROUTE}`, () => {
  it('responds with an array of todos', () =>
    request(app)
      .get(BASE_ROUTE)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200).then(response => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});

describe(`POST ${BASE_ROUTE}`, () => {
  it('responds with an error if the todo is invalid', () =>
    request(app)
      .post(BASE_ROUTE)
      .set('Accept', 'application/json')
      .send({ content: '' })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }),
  );

  it('responds with an inserted object', () =>
    request(app)
      .post(BASE_ROUTE)
      .set('Accept', 'application/json')
      .send({ content: 'Learn typescript' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(async (response) => {
        await Todos.deleteOne({ _id: new ObjectId(response.body._id ) });

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
        expect(response.body.content).toBe('Learn typescript');
      }),
  );
});

describe(`GET ${BASE_ROUTE}/:id`, () => {
  it('responds with an invalid ObjectId error', (done) =>{
    request(app)
      .get(`${BASE_ROUTE}/invalid-object-id`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) =>{
    request(app)
      .get(`${BASE_ROUTE}/64ad570b443a67ddd13048d0`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single todo', () =>
    request(app)
      .post(BASE_ROUTE)
      .set('Accept', 'application/json')
      .send({ content: 'Learn typescript' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(({ body }) => 
        request(app)
          .get(`${BASE_ROUTE}/${body._id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(async (response) => {
            await Todos.deleteOne({ _id: new ObjectId(body._id ) });

            expect(response.body).toHaveProperty('_id');
            expect(response.body._id).toBe(body._id);
            expect(response.body).toHaveProperty('content');
            expect(response.body).toHaveProperty('done');
            expect(response.body.content).toBe('Learn typescript');
          })),
  );
});

describe(`PUT ${BASE_ROUTE}/:id`, () => {
  const payload = { content: 'Learn typescript', done: true };
 
  it('responds with an invalid ObjectId error', (done) =>{
    request(app)
      .put(`${BASE_ROUTE}/invalid-object-id`)
      .set('Accept', 'application/json')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) =>{
    request(app)
      .put(`${BASE_ROUTE}/64ad570b443a67ddd13048d0`)
      .set('Accept', 'application/json')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single todo', () =>
    request(app)
      .post(BASE_ROUTE)
      .set('Accept', 'application/json')
      .send({ content: 'Learn typescript' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(({ body }) => 
        request(app)
          .put(`${BASE_ROUTE}/${body._id}`)
          .set('Accept', 'application/json')
          .send(payload)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(async (response) => {
            await Todos.deleteOne({ _id: new ObjectId(body._id ) });

            expect(response.body).toHaveProperty('_id');
            expect(response.body._id).toBe(body._id);
            expect(response.body).toHaveProperty('content');
            expect(response.body).toHaveProperty('done');
            expect(response.body.done).toBe(true);
          })),
  );
});

describe(`DELETE ${BASE_ROUTE}/:id`, () => {
  it('responds with an invalid ObjectId error', (done) =>{
    request(app)
      .delete(`${BASE_ROUTE}/invalid-object-id`)
      .expect(422, done);
  });
  it('responds with a not found error', (done) =>{
    request(app)
      .delete(`${BASE_ROUTE}/64ad570b443a67ddd13048d0`)
      .expect(404, done);
  });
  it('responds with a 204 status code', (done) => { 
    request(app)
      .post(BASE_ROUTE)
      .set('Accept', 'application/json')
      .send({ content: 'Learn typescript' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(({ body }) => 
        request(app)
          .delete(`${BASE_ROUTE}/${body._id}`)
          .expect(204).then(async () => {
            await Todos.deleteOne({ _id: new ObjectId(body._id ) });
            done();
          }),
      );
  });
});
