/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');

const AuthDataSource = require('../Connections/AuthService.datasource');
const MongoDataSource = require('../Connections/Mongo.datasource');
const LoginController = require('./Login.controller');

describe('Controller: Login', () => {
  it('exists', () => {
    expect(LoginController).to.be.a('object');
  });

  describe('login', () => {

    it('enforces required fields', (done) => {
      LoginController.login({}, (err) => {
        expect(err.internalCode).to.equal(422);
        done();
      });
    });

    it('handles MongoDataSource errors', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(new Error());
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

    it('handles no matching users', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, []);
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        expect(err.internalCode).to.equal(404);
        done();
      });
    });

    it('handles multiple matching user records', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ {}, {} ]);
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        expect(err.internalCode).to.equal(404);
        done();
      });
    });

    it('handles inactive user profiles', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ { active: false } ]);
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        expect(err.internalCode).to.equal(403);
        done();
      });
    });

    it('handles inactive user profiles', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ { active: true } ]);
      });

      sinon.stub(AuthDataSource, 'validate').callsFake((err, cb) => {
        return cb(new Error());
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();
        AuthDataSource.validate.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

    it('validates a user', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ { active: true, id: 'match' } ]);
      });

      sinon.stub(AuthDataSource, 'validate').callsFake((err, cb) => {
        return cb(undefined, { id: 'match'} );
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err, user) => {
        MongoDataSource.get.restore();
        AuthDataSource.validate.restore();

        expect(user).to.be.a('object');
        done();
      });
    });

    it('requires that both systems agree on the id', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ { active: true, id: 'noMatch' } ]);
      });

      sinon.stub(AuthDataSource, 'validate').callsFake((err, cb) => {
        return cb(undefined, { id: 'match'} );
      });

      LoginController.login({nameLogin: 'testName', password: 'password'}, (err) => {
        MongoDataSource.get.restore();
        AuthDataSource.validate.restore();

        expect(err).to.be.a('Error');
        expect(err.internalCode).to.equal(500);
        done();
      });
    });

  });

});
