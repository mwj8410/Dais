/* global after, before, describe, it, require */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const sinon = require('sinon');

const UserController = require('../Controllers/User.controller');
const UserHelper = require('../../tests/helpers/User.helper');

chai.use(chaiHttp);

describe('Handler: User', () => {
  let request;
  let loggedInUser;

  const standardUserFixture = UserHelper.getFixture('standardUser');

  before((done) => {
    request = chai.request.agent(global.application);

    UserHelper.getStandardUser((error, userAgent) => {
      loggedInUser = userAgent;
      done();
    });
  });

  describe('GET /user', () => {
    const route = `/user/${standardUserFixture.id}`;

    it('requires an active session', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      request
        .get(route)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(401);
          done();
        });
    });

    it('allows a user to get their own record', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      loggedInUser
        .get(route)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(200);
          done();
        });
    });

    it('requires that the provided value be the correct type', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      loggedInUser
        .get(`/user/NOPE!`)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(422);
          done();
        });
    });

    it('handles errors in the controller layer', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(new Error(), { id: standardUserFixture.id });
      });

      loggedInUser
        .get(route)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(500);
          done();
        });
    });

    it('handles no matching user records', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        let err = new Error();
        err.inernalCode = 404;
        return cb(err);
      });

      loggedInUser
        .get(route)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(404);
          done();
        });
    });

  });

  describe('POST /user', () => {
    const route = '/user';

    it('fails when parameters are missing', (done) => {
      request
        .post(route)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(422);
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
        .end((err, res) => {
          UserController.create.restore();

          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal('1234');
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
        .end((err, res) => {
          UserController.create.restore();

          expect(res.status).to.equal(422);
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
        .end((err, res) => {
          UserController.create.restore();

          expect(res.status).to.equal(500);
          done();
        });
    });

  });

  describe('PUT /user', () => {
    const route = `/user/${standardUserFixture.id}`;

    it('requires an active session', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      request
        .put(route)
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(401);
          done();
        });
    });

    it('requires that the provided value be the correct type', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      loggedInUser
        .put('/user/NOPE!')
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(422);
          done();
        });
    });

    it('allows a user to modify their own account', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      loggedInUser
        .put(route)
        .send({
          email: 'test@email.com',
          nameDisplay: 'New Display Name'
        })
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(200);
          done();
        });
    });

    it('does not allow a user to modify their other account', (done) => {
      sinon.stub(UserController, 'get').callsFake((criteria, flag, cb) => {
        return cb(undefined, { id: standardUserFixture.id });
      });

      loggedInUser
        .put('/user/73802660-c6a6-4273-92b0-f3cf9350674a')
        .send({
          email: 'test@email.com',
          nameDisplay: 'New Display Name'
        })
        .end((err, res) => {
          UserController.get.restore();

          expect(res.status).to.equal(401);
          done();
        });
    });

  });

});
