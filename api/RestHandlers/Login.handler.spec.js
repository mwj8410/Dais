/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');

const LoginController = require('../Controllers/Login.controller');

describe('Handler: Login', () => {
  let request;

  before(() => {
    request = supertest(global.application);
  });

  describe('login', () => {
    it('fails when parameters are missing', (done) => {
      request
        .post('/login')
        .expect(422)
        .send({
          nameLogin: 'testName'
        })
        .then(() => {
          done();
        });
    });

    it('accepts credentials', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        return cb(undefined, { id: '123456' });
      });

      request
        .post('/login')
        .expect(200)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then((response) => {
          LoginController.login.restore();

          // console.log(response.body)
          expect(response.body.id).to.equal('123456');

          done();
        });
    });

    it('handles server errors', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        let err = new Error('');
        err.internalCode = 500;
        return cb(err);
      });

      request
        .post('/login')
        .expect(500)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then(() => {
          LoginController.login.restore();

          done();
        });
    });

    it('handles the User not existing', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        let err = new Error('');
        err.internalCode = 404;
        return cb(err);
      });

      request
        .post('/login')
        .expect(401)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then(() => {
          LoginController.login.restore();

          done();
        });
    });

    it('handles an inactive User record', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        let err = new Error('');
        err.internalCode = 403;
        return cb(err);
      });

      request
        .post('/login')
        .expect(401)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then(() => {
          LoginController.login.restore();

          done();
        });
    });

    it('handles if the controller values are malformed', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        let err = new Error('');
        err.internalCode = 422;
        return cb(err);
      });

      request
        .post('/login')
        .expect(422)
        .send({
          nameLogin: 'testName',
          password: 'Abc123'
        })
        .then(() => {
          LoginController.login.restore();

          done();
        });
    });

  });

  describe('logout', () => {
    it('processes the response', (done) => {
      request
        .post('/login/logout')
        .expect(200)
        .then(() => {
          done();
        });
    });
  });

});
