/* global describe, it, reuire */

const expect = require('expect');
const st = require('supertest');

let request = st('http://localhost:24601');

describe('Controller >> User:', () => {

  describe('create', () => {
    it('does not allow creation', done => {
      request.post('/user')
      .send({})
      .end((err, response) => {
        expect(response.status).toBe(401);
        done();
      });
    });
  });

  describe('get', () => {

    it('requires a user id', done => {
      request.get('/user')
      .end((err, response) => {
        expect(response.status).toBe(404);
        done();
      });
    });

    it('responds to requests', done => {
      request.get('/user/1')
      .end((err, response) => {
        expect(response.status).toBe(200);
        done();
      });
    });
  });

});
