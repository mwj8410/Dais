/* global after, before, describe, it, require */

const expect = require('chai').expect;
const sinon = require('sinon');

const MongoDataSource = require('../Connections/Mongo.datasource');
const LoginController = require('./Login.controller');
const MandrillService = require('../Connections/Mandrill.service');
const UserController = require('./User.controller');
const passwordService = require('../Utilities/password');

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

      LoginController.login({ nameLogin: 'testName', authPassword: 'password' }, (err) => {
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

      LoginController.login({nameLogin: 'testName', authPassword: 'password'}, (err) => {
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

      LoginController.login({nameLogin: 'testName', authPassword: 'password'}, (err) => {
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

      LoginController.login({nameLogin: 'testName', authPassword: 'password'}, (err) => {
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

      LoginController.login({nameLogin: 'testName', authPassword: 'password'}, (err) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

    it('validates a user', (done) => {
      const salt = passwordService.createSalt();
      const password = passwordService.hashPassword('Abcd1234', salt);

      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        expect(criteria.nameLogin).to.equal('testName');
        return cb(undefined, [ { active: true, authPassword: password, authSalt: salt } ]);
      });

      LoginController.login({nameLogin: 'testName', authPassword: 'Abcd1234'}, (err, user) => {
        MongoDataSource.get.restore();

        expect(user).to.be.a('object');
        done();
      });
    });

    it('correctly fails when the passwords don\'t match', (done) => {
      const salt = passwordService.createSalt();
      const password = passwordService.hashPassword('Abcd1234', salt);

      sinon.stub(MongoDataSource, 'get').callsFake((err, criteria, cb) => {
        return cb(undefined, [ { active: true, authPassword: password, authSalt: salt } ]);
      });

      LoginController.login({nameLogin: 'noMatch', authPassword: 'noMatch'}, (err, user) => {
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

  });

  describe('registerClaim', () => {

    it('exists', () => {
      expect(LoginController.registerClaim).to.be.a('function');
    });

    it('registers a new User', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, []);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error, user) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(user[0]).to.be.a('object');
      });
    });

    it('registers an existing User', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ {} ]);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error, user) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(user[0]).to.be.a('object');
      });
    });

    it('handles errors in MongoDataSource.get()', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(new Error(), []);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
      });
    });

    it('handles errors in UserController.create()', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, []);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        let err = new Error();
        err.internalCode = 42;
        cb(err, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
      });
    });

    it('handles errors in MandrillService.send()', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, []);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(new Error());
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
      });
    });

    it('handles errors in MongoDataSource.update()', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, []);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(new Error(), [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
      });
    });

    it('reports registration of active users as being in error', () => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ { active: true } ]);
      });

      sinon.stub(UserController, 'create').callsFake((values, cb) => {
        cb(undefined, values);
      });

      sinon.stub(MandrillService, 'send').callsFake((template, email, options, cb) => {
        cb(undefined);
      });

      sinon.stub(MongoDataSource, 'update').callsFake((collectionName, criteria, values, cb) => {
        cb(undefined, [ { id: 'test' } ]);
      });

      LoginController.registerClaim('test@email.com', (error, user) => {
        MongoDataSource.get.restore();
        UserController.create.restore();
        MandrillService.send.restore();
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
      });
    });

  });

  describe('registerClaimValidate', () => {

    it('exists', () => {
      expect(LoginController.registerClaimValidate).to.be.a('function');
    });

  });

  describe('setPassword', () => {

    it('exists', () => {
      expect(LoginController.setPassword).to.be.a('function');
    });

  });

});
