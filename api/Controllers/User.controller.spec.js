/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');

const MongoDataSource = require('../Connections/Mongo.datasource');
const UserController = require('./User.controller');

describe('Controller: User', () => {
  it('exists', () => {
    expect(UserController).to.be.a('object');
  });

  describe('create', () => {

    it('exists', () =>{
      expect(UserController.create).to.be.a('function');
    });

    it('enforces required values', (done) => {
      UserController.create({}, (error, resultingRecord) => {
        expect(error.message.indexOf('Missing') >= 0).to.equal(true);
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('enforces value types on required fields', (done) => {
      UserController.create({
        email: 'notAnEmail',
        nameDisplay: '',
        nameLogin: ''
      }, (error, resultingRecord) => {
        expect(error.message.indexOf('Invalid') >= 0).to.equal(true);
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('enforces value types on optional fields', (done) => {
      UserController.create({
        email: 'test@email.com',
        nameDisplay: '',
        nameLogin: '',
        nameFirst: 1234 // wrong type

      }, (error, resultingRecord) => {
        expect(error.message.indexOf('Invalid') >= 0).to.equal(true);
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('creates a new User record and passes it to the Data Layer', (done) => {
      sinon.stub(MongoDataSource, 'create').callsFake((collectionName, passedValues, cb) => {
        expect(collectionName).to.equal('User');

        // Just pass it through as if it worked fine
        return cb(undefined, passedValues);
      });

      UserController.create({
        email: 'test@email.com',
        nameDisplay: 'a name',
        nameLogin: 'another name'
      }, (error, resultingRecord) => {
        MongoDataSource.create.restore();

        expect(error).to.be.a('undefined');

        expect(resultingRecord.id).to.be.a('string');
        expect(resultingRecord.createdDate).to.be.a('date');
        expect(resultingRecord.updatedDate).to.be.a('date');
        expect(resultingRecord.active).to.be.a('boolean');
        expect(resultingRecord.active).to.equal(true);
        done();
      });
    });

    it('handles errors in the Data Layer', (done) => {
      sinon.stub(MongoDataSource, 'create').callsFake((collectionName, passedValues, cb) => {
        expect(collectionName).to.equal('User');

        // Just pass it through as if it worked fine
        return cb(new Error);
      });

      UserController.create({
        email: 'test@email.com',
        nameDisplay: 'a name',
        nameLogin: 'another name'
      }, (error) => {
        MongoDataSource.create.restore();

        expect(error).to.be.a('Error');
        done();
      });
    });

  });

  describe('get', () => {

    it('exists', () =>{
      expect(UserController.get).to.be.a('function');
    });

    it('handles errors in Data Layer', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        return cb(new Error);
      });

      UserController.get('anId', false, (error, resultingRecord) => {
        MongoDataSource.get.restore();

        expect(error).to.be.a('Error');
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('reports and error when no documents match', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        return cb(undefined, []);
      });

      UserController.get('anId', false, (error, resultingRecord) => {
        MongoDataSource.get.restore();

        expect(error).to.be.a('Error');
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('retrieves a record', (done) => {
      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        return cb(undefined, [ { id: 'test' } ]);
      });

      UserController.get('anId', false, (error, resultingRecord) => {
        MongoDataSource.get.restore();

        expect(error).to.be.a('undefined');
        expect(resultingRecord).to.be.a('object');
        expect(resultingRecord.id).to.equal('test');
        done();
      });
    });

  });

  describe('update', () => {

    it('exists', () =>{
      expect(UserController.update).to.be.a('function');
    });

    it('handles errors in Data Layer', (done) => {
      sinon.stub(MongoDataSource, 'update')
        .callsFake((collectionName, criteria, values, cb) => {
          return cb(new Error);
        });

      UserController.update('anId', { value: 'test' }, (error, resultingRecord) => {
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('reports an error when no records are returned', (done) => {
      sinon.stub(MongoDataSource, 'update')
        .callsFake((collectionName, criteria, values, cb) => {
          return cb(undefined, []);
        });

      UserController.update('anId', { value: 'test' }, (error, resultingRecord) => {
        MongoDataSource.update.restore();

        expect(error).to.be.a('Error');
        expect(resultingRecord).to.be.a('undefined');
        done();
      });
    });

    it('updates a record', (done) => {
      sinon.stub(MongoDataSource, 'update')
        .callsFake((collectionName, criteria, values, cb) => {
          return cb(undefined, [ {} ]);
        });

      UserController.update('anId', { value: 'test' }, (error, resultingRecord) => {
        MongoDataSource.update.restore();

        expect(error).to.be.a('undefined');
        expect(resultingRecord).to.be.a('object');
        done();
      });
    });

  });

});
