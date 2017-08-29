/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');

describe('Handler: Login', () => {
  let request;

  before(() => {
    request = supertest(global.application);
  });

  describe('login', () => {
    it('fails when parameters are missing', (done) => {
      request
        .post('/rest/login')
        .expect(422)
        .send({
          nameLogin: 'testName'
        })
        .then(() => {
          done();
        });
    });

    it('accepts credentials', (done) => {
      request
        .post('/rest/login')
        .expect(200)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then(() => {
          done();
        });
    });
  });

  describe('logout', () => {
    it('processes the response', (done) => {
      request
        .post('/rest/login/logout')
        .expect(200)
        .then(() => {
          done();
        });
    });
  });

});
