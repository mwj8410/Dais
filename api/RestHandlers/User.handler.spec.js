/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');

const UserController = require('../Controllers/User.controller');

describe('Handler: User', () => {
  let request;
  let user;

  before(() => {
    request = supertest(global.application);
    user = supertest(global.application);
  });

  describe('GET /user', () => {
    const route = '/user/123';

    it('requires an active session', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: '1234' });
      });

      request
        .get(route)
        .expect(401)
        .then(() => {
          UserController.get.restore();
          done();
        });
    });

    // Requires that login logic be set
    // it('requires an active session', (done) => {
    //   sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
    //     return cb(undefined, { id: '1234' });
    //   });
    //
    //   request
    //     .get(route)
    //     .expect(200)
    //     .then(() => {
    //       UserController.get.restore();
    //       done();
    //     });
    // });

  });

  describe('POST /user', () => {
    const route = '/user';

    it('fails when parameters are missing', (done) => {
      request
        .post(route)
        .expect(422)
        .send({
        })
        .then(() => {
          done();
        });
    });

    it('processes a correctly formatted request', (done) => {
      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        return cb(undefined, { id: '1234' });
      });

      request
        .post(route)
        .send({
          email: 'test@email.com',
          nameDisplay: 'Display Name',
          nameFirst: 'First',
          nameLast: 'Last',
          nameLogin: 'loginName',
          dateOfBirth: '2024-04-08T00:00:00.000Z'
        })
        .expect(200)
        .then((response) => {
          UserController.create.restore();
          expect(response.body.id).to.equal('1234');
          done();
        });
    });

    it('reports value rejections form the controller layer', (done) => {
      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        let errorObject = new Error();
        errorObject.inernalCode = 422;
        return cb(errorObject);
      });

      request
        .post(route)
        .send({
          email: 'test@email.com',
          nameDisplay: 'Display Name',
          nameFirst: 'First',
          nameLast: 'Last',
          nameLogin: 'loginName',
          dateOfBirth: '2024-04-08T00:00:00.000Z'
        })
        .expect(422)
        .then(() => {
          UserController.create.restore();

          done();
        });
    });

    it('reports unknown errors from the controller layer', (done) => {
      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        let errorObject = new Error();
        return cb(errorObject);
      });

      request
        .post(route)
        .send({
          email: 'test@email.com',
          nameDisplay: 'Display Name',
          nameFirst: 'First',
          nameLast: 'Last',
          nameLogin: 'loginName',
          dateOfBirth: '2024-04-08T00:00:00.000Z'
        })
        .expect(500)
        .then(() => {
          UserController.create.restore();

          done();
        });
    });

  });

  describe('PUT /user', () => {

  });

});
