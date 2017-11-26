/* global module */

/**
 * Provides a connection into a specific data source using a specified connector.
 */

const Log = require('../Utilities/log');
const MongoConnector = require('../Utilities/Connectors/Mongo.connector');

const MongoDataSourceSchema = require('../../Database/MongoDataSource/MongoDataSource.schema');

// corresponds to an entry in `./config/connectionSources.config.js`
const connectionName = 'mongo';

let db;

const MongoDataSource = {
  /**
   * Establishes the connection to the remote data source
   * @return {Promise} That this module will have a connection.
   */
  connect: () => {
    return MongoConnector(connectionName)
      .then((dbConnection) => {
        Log.notice('MongoDataSource', 'connect', 'Connected to remote data source: Mongo');
        db = dbConnection;
        MongoDataSource.initializeDatabase();
      });
  },

  /**
   * Used to create records in a collection. Adds a `createdAt` date to the record.
   * @param {string} collectionName The name of the collection in which to create the record.
   * @param {object} values The raw object that will becoe the record.
   * @param {function} callback Error first method to be called once the operation has completed.
   */
  create: (collectionName, values, callback) => {
    let newValues = Object.assign({}, values, { createdAt: new Date() });

    db.collection(collectionName).insertOne(newValues, (error, response) => {
      if (error) {
        if (error.message.indexOf('duplicate key error collection') >= 0) {
          Log.warning('MongoDataSource Connection', 'Create', `Attempt to create a duplicate entry.${error}`);
          return callback(error);
        }
        Log.error('MongoDataSource Connection', 'Create', 'Encountered an error creating a record.', error);
        return callback(error);
      }
      callback(undefined, response.ops);
    });
  },

  /**
   * Used to fetch records from a collection.
   * @param {string} collectionName Indicates the name of the MongoDatasource collection
   * @param {object} criteria the search criteria
   * @param {function} callback Error first method to be called with results.
   */
  get: (collectionName, criteria, callback) => {
    return db.collection(collectionName)
      .find(criteria)
      .toArray(callback);
  },

  /**
   * Used to fetch the actual connection to mongo. Primarily for use in testing to provide a stub-able interface.
   * @returns {object} a raw connection the the MongoDatasource instance.
   */
  getRawConnection: () => {
    return db;
  },

  /**
   * Checks that the database expresses the expected collections and creates them if not.
   */
  initializeDatabase: () => {
    db.collections((error, collections) => {
      let collectionNames;
      if (error) {
        Log.error('MongoDataSource', 'initializeDatabase', 'Encountered an error while fetching existing collections.', error);
        return;
      }
      collectionNames = collections.map((item) => item.s.name);

      let actions = [];

      MongoDataSourceSchema.forEach((collection) => {
        // If the collection does not exist
        if (collectionNames.indexOf(collection.collectionName) < 0) {
          // The collection does not exist and needs to be created.
          actions.push(
            new Promise((resolve, reject) => {
              db.createCollection(collection.collectionName, (error, collection) => {
                if (error) {
                  Log.error('MongoDataSource', 'initializeDatabase', 'Encountered an error while creating a collection.', error);
                  return reject(error);
                }
                Log.notice('MongoDataSource', 'initializeDatabase', `Created '${collection.collectionName}' collection`);
                // Consider adding logic to create database indexes.
                return resolve();
              });
            }) // Closes Promise
          );
        }
      });

      if (actions.length === 0 ) {
        return;
      }
      Promise.all(actions)
        .then(() => {
          Log.notice('MongoDataSource', 'initializeDatabase', 'Data Source Initialization completed.');
        })
        .catch((error) => {
          // Consider downgrading the error message to a warning because the error should have already been logged
          Log.error('MongoDataSource', 'initializeDatabase', 'Encountered an error during Data Source initialization.', error);
        });
    });
  },

  /**
   * Used to update existing records. Adds a `updatedAt` date to the record provided.
   * @param {string} collectionName The collection name that the record to be updated exists in.
   * @param {object} criteria Search criteria for the record to be updated.
   * @param {object} updateObject the complete object that will replace the existing record.
   * @param {function} callback Error first method to be called once the operation has completed.
   */
  update: (collectionName, criteria, updateObject, callback) => {
    updateObject.updatedAt = new Date();
    return db.collection(collectionName)
      .update(criteria, updateObject, (error) => {
        if (error) {
          if (error.message.indexOf('duplicate key error collection') >= 0) {
            Log.info('MongoDataSource Connection', 'Create', `Attempt to create a duplicate entry.\n${error}`);
            return callback(error);
          }
          Log.error('MongoDataSource Connection', 'Create', 'Encountered an error creating a record.', error);
          return callback(error);
        }
        MongoDataSource.get(collectionName, criteria, (error, records) => {
          if (error) {
            // Error is logged in the get operation
            return callback(error);
          }
          callback(undefined, records);
        });
      });
  }

};

module.exports = MongoDataSource;
