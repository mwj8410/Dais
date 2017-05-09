/* global describe, it, reuire */

const expect = require('expect');
const supertest = require('supertest');

let request = supertest('http://localhost:24601');

describe('Controller >> User:', () => {

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
