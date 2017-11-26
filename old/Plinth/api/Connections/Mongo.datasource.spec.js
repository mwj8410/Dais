/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');

const MongoDataSource = require('./Mongo.datasource');

describe('Data Source: Mongo', () => {

  before((done) => {
    MongoDataSource.connect().then(() => {
      done();
    });
  });

  describe('create', () => {
    it('exists', () => {
      expect(MongoDataSource.create).to.be.a('function');
    });

    it('calls the correct collection and inserts the correct record', (done) => {
      let db = MongoDataSource.getRawConnection();
      let calledCollection;
      let calledValues;

      sinon.stub(db, 'collection').callsFake((collectionName) => {
        calledCollection = collectionName;
        return {
          insertOne: (values, cb) => {
            calledValues = values;
            cb(undefined, { response: { ops: 'response record' } });
          }
        };
      });

      MongoDataSource.create('test', { value: 'record' }, (err) => {
        db.collection.restore();

        expect(err).to.be.a('undefined');
        expect(calledCollection).to.be.equal('test');
        expect(calledValues).to.be.a('object');
        expect(calledValues.value).to.equal('record');
        done();
      });
    });

    it('reports duplicate key errors', (done) => {
      let db = MongoDataSource.getRawConnection();

      sinon.stub(db, 'collection').callsFake(() => {
        return {
          insertOne: (values, cb) => {
            let error = new Error();
            error.message = 'duplicate key error collection';
            cb(error, { response: { ops: 'response record' } });
          }
        };
      });

      MongoDataSource.create('test', { value: 'record' }, (err) => {
        db.collection.restore();

        expect(err).to.be.a('Error');
        expect(err.message).to.be.equal('duplicate key error collection');
        done();
      });
    });

    it('reports other errors', (done) => {
      let db = MongoDataSource.getRawConnection();

      sinon.stub(db, 'collection').callsFake(() => {
        return {
          insertOne: (values, cb) => {
            cb(new Error(), { response: { ops: 'response record' } });
          }
        };
      });

      MongoDataSource.create('test', { value: 'record' }, (err) => {
        db.collection.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

  });

  describe('get', () => {

    it('exists', () => {
      expect(MongoDataSource.get).to.be.a('function');
    });

    it('calls the correct collection and inserts the correct record', (done) => {
      let db = MongoDataSource.getRawConnection();
      let calledCollection;
      let calledValues;

      sinon.stub(db, 'collection').callsFake((collectionName) => {
        calledCollection = collectionName;
        return {
          find: (values) => {
            calledValues = values;
            return { toArray: (callback) => {
              callback();
            } };
          }
        };
      });

      MongoDataSource.get('test', { value: 'record' }, (err) => {
        db.collection.restore();

        expect(err).to.be.a('undefined');
        expect(calledCollection).to.be.equal('test');
        expect(calledValues).to.be.a('object');
        expect(calledValues.value).to.equal('record');
        done();
      });
    });

  });

  describe('getRawConnection', () => {
    it('exists', () => {
      expect(MongoDataSource.getRawConnection).to.be.a('function');
    });

    it('provides a MongoDatasource database connection', () => {
      let rawCon = MongoDataSource.getRawConnection();

      expect(rawCon).to.be.a('object');
      expect(rawCon.collection).to.be.a('function');
    });
  });

  describe('initializeDatabase', () => {

    it('exists', () => {
      expect(MongoDataSource.initializeDatabase).to.be.a('function');
    });

    it('handles errors in collections', () => {
      let db = MongoDataSource.getRawConnection();
      let collectionsCalled = false;

      sinon.stub(db, 'collections').callsFake((callback) => {
        collectionsCalled = true;
        callback(new Error());
      });

      MongoDataSource.initializeDatabase();

      db.collections.restore();

      expect(collectionsCalled).to.equal(true);
    });

    it('creates collections', () => {
      let db = MongoDataSource.getRawConnection();
      let collectionsCalled = false;
      let timesCreateCalled = 0;

      sinon.stub(db, 'collections').callsFake((callback) => {
        collectionsCalled = true;
        callback(undefined, []);
      });

      sinon.stub(db, 'createCollection').callsFake((collectionName, callback) => {
        timesCreateCalled += 1;
        callback(undefined, 'fakeName');
      });

      MongoDataSource.initializeDatabase();

      db.collections.restore();
      db.createCollection.restore();

      expect(timesCreateCalled).to.equal(1);
      expect(collectionsCalled).to.equal(true);
    });

    it('handles errors in collection create', () => {
      let db = MongoDataSource.getRawConnection();
      let collectionsCalled = false;
      let timesCreateCalled = 0;

      sinon.stub(db, 'collections').callsFake((callback) => {
        collectionsCalled = true;
        callback(undefined, []);
      });

      sinon.stub(db, 'createCollection').callsFake((collectionName, callback) => {
        timesCreateCalled += 1;
        callback(new Error());
      });

      MongoDataSource.initializeDatabase();

      db.collections.restore();
      db.createCollection.restore();

      expect(timesCreateCalled).to.equal(1);
      expect(collectionsCalled).to.equal(true);
    });

  });

  describe('update', () => {
    it('exists', () => {
      expect(MongoDataSource.get).to.be.a('function');
    });

    it('calls the correct collection and inserts the correct record', (done) => {
      let db = MongoDataSource.getRawConnection();
      let calledCollection;
      let calledCriteria;
      let calledValues;

      sinon.stub(db, 'collection').callsFake((collectionName) => {
        calledCollection = collectionName;
        return {
          update: (criteria, values, callback) => {
            calledCriteria = criteria;
            calledValues = values;
            callback();
          }
        };
      });

      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ { id: '1' } ]);
      });

      MongoDataSource.update('test', { id: 1 }, { value: 2 }, (err) => {
        db.collection.restore();
        MongoDataSource.get.restore();

        expect(err).to.be.a('undefined');
        expect(calledCollection).to.be.equal('test');
        expect(calledCriteria.id).to.be.equal(1);
        expect(calledValues.value).to.be.equal(2);
        done();
      });
    });

    it('calls the correct collection and inserts the correct record', (done) => {
      let db = MongoDataSource.getRawConnection();
      let calledCollection;
      let calledCriteria;
      let calledValues;

      sinon.stub(db, 'collection').callsFake((collectionName) => {
        calledCollection = collectionName;
        return {
          update: (criteria, values, callback) => {
            calledCriteria = criteria;
            calledValues = values;
            callback();
          }
        };
      });

      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ { id: '1' } ]);
      });

      MongoDataSource.update('test', { id: 1 }, { value: 2 }, (err) => {
        db.collection.restore();
        MongoDataSource.get.restore();

        expect(err).to.be.a('undefined');
        expect(calledCollection).to.be.equal('test');
        expect(calledCriteria.id).to.be.equal(1);
        expect(calledValues.value).to.be.equal(2);
        done();
      });
    });

    it('reports duplicate record errors', (done) => {
      let db = MongoDataSource.getRawConnection();

      sinon.stub(db, 'collection').callsFake(() => {
        return {
          update: (criteria, values, callback) => {
            let error = new Error();
            error.message = 'duplicate key error collection';
            callback(error);
          }
        };
      });

      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ { id: '1' } ]);
      });

      MongoDataSource.update('test', { id: 1 }, { value: 2 }, (err) => {
        db.collection.restore();
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        expect(err.message).to.be.equal('duplicate key error collection');
        done();
      });
    });

    it('reports general errors', (done) => {
      let db = MongoDataSource.getRawConnection();

      sinon.stub(db, 'collection').callsFake(() => {
        return {
          update: (criteria, values, callback) => {
            callback(new Error());
          }
        };
      });

      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(undefined, [ { id: '1' } ]);
      });

      MongoDataSource.update('test', { id: 1 }, { value: 2 }, (err) => {
        db.collection.restore();
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

    it('handles errors in peer methods', (done) => {
      let db = MongoDataSource.getRawConnection();

      sinon.stub(db, 'collection').callsFake(() => {
        return {
          update: (criteria, values, callback) => {
            callback(new Error());
          }
        };
      });

      sinon.stub(MongoDataSource, 'get').callsFake((collectionName, criteria, cb) => {
        cb(new Error(), [ { id: '1' } ]);
      });

      MongoDataSource.update('test', { id: 1 }, { value: 2 }, (err) => {
        db.collection.restore();
        MongoDataSource.get.restore();

        expect(err).to.be.a('Error');
        done();
      });
    });

  });
});
