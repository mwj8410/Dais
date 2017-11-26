/* global after, before, describe, it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const sinon = require('sinon');

const LoginController = require('../Controllers/Login.controller');

chai.use(chaiHttp);

describe('Handler: Login', () => {
  let request;

  before(() => {
    request = chai.request.agent(global.application);
  });

  describe('login', () => {

    it('fails when parameters are missing', (done) => {
      request
        .post('/login')
        .send({
          nameLogin: 'testName'
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('accepts credentials', (done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        return cb(undefined, { id: '123456' });
      });

      request
        .post('/login')
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();

          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal('123456');
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
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();

          expect(res.status).to.equal(500);
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
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();

          expect(res.status).to.equal(401);
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
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();

          expect(res.status).to.equal(401);
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
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();

          expect(res.status).to.equal(422);
          done();
        });
    });

  });

  describe('logout', () => {
    it('processes the response', (done) => {
      request
        .post('/login/logout')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('registerClaim', () => {

    it('enforces required data', (done) => {
      request
        .post('/login/register/claim')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('enforces required data', (done) => {
      sinon.stub(LoginController, 'registerClaim').callsFake((email, cb) => {
        return cb(undefined);
      });

      request
        .post('/login/register/claim')
        .send({
          email: 'test@email.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          LoginController.registerClaim.restore();
          done();
        });
    });

    it('handles errors in controller', (done) => {
      sinon.stub(LoginController, 'registerClaim').callsFake((email, cb) => {
        return cb(new Error());
      });

      request
        .post('/login/register/claim')
        .send({
          email: 'test@email.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          LoginController.registerClaim.restore();
          done();
        });
    });

  });

  describe('registerClaimValidate', () => {

    it('enforces required data', (done) => {
      request
        .post('/login/register/claimValidate')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('enforces required data', (done) => {
      sinon.stub(LoginController, 'registerClaimValidate').callsFake((email, token, cb) => {
        return cb(undefined, { email: email });
      });

      request
        .post('/login/register/claimValidate?email=test@email.com&token=abcd123')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          LoginController.registerClaimValidate.restore();
          done();
        });
    });

    it('handles errors in controller', (done) => {
      sinon.stub(LoginController, 'registerClaimValidate').callsFake((email, token, cb) => {
        return cb(new Error());
      });

      request
        .post('/login/register/claimValidate?email=test@email.com&token=abcd123')
        .end((err, res) => {
          expect(res.status).to.equal(500);
          LoginController.registerClaimValidate.restore();
          done();
        });
    });

  });

  describe('setPassword', () => {
    let loggedInUser;

    before((done) => {
      sinon.stub(LoginController, 'login').callsFake((values, cb) => {
        return cb(undefined, { id: '123456' });
      });

      loggedInUser = chai.request.agent(global.application);
      loggedInUser
        .post('/login')
        .send({
          nameLogin: 'testName',
          authPassword: 'Abc123'
        })
        .end((err, res) => {
          LoginController.login.restore();
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('enforces required data', (done) => {
      loggedInUser
        .post('/login/setPassword')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('changes the user\'s password', (done) => {
      sinon.stub(LoginController, 'setPassword').callsFake((userId, newAuthPassword, cb) => {
        return cb(undefined, { id: 'not-real', email: 'test@email.com' });
      });

      loggedInUser
        .post('/login/setPassword')
        .send({
          newAuthPassword: 'Abcd1234'
        })
        .end((err, res) => {
          LoginController.setPassword.restore();

          expect(res.status).to.equal(200);
          done();
        });
    });

    it('handles errors in the Controller layer', (done) => {
      sinon.stub(LoginController, 'setPassword').callsFake((userId, newAuthPassword, cb) => {
        return cb(new Error(), { id: 'not-real', email: 'test@email.com' });
      });

      loggedInUser
        .post('/login/setPassword')
        .send({
          newAuthPassword: 'Abcd1234'
        })
        .end((err, res) => {
          LoginController.setPassword.restore();

          expect(res.status).to.equal(500);
          done();
        });
    });

  });

});
