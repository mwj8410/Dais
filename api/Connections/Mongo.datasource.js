/**
 * Provides a connection into a specific data source using a specified connector.
 */

// ToDo: establish a migration pattern
// ToDo: full unit testing

import Log from '../Utilities/log';
import MongoConnector from '../Utilities/connectors/Mongo.connector';

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
      .then(dbConnection => {
        db = dbConnection;
      });
  },

  /**
   * Used to create records in a collection. Adds a `createdAt` date to the record.
   * @param {string} collectionName The name of the collection in which to create the record.
   * @param {object} values The raw object that will becoe the record.
   * @param {function} callback Error first method to be called once the operation has completed.
   */
  create: (collectionName, values, callback) => {
    values.createdAt = new Date();
    db.collection(collectionName).insertOne(values, (error, response) => {
      if (error) {
        if (error.message.indexOf('duplicate key error collection') >= 0) {
          Log.info('Mongo Connection', 'Create', 'Attempt to create a duplicate entry.', error);
          return callback(error);
        }
        Log.error('Mongo Connection', 'Create', 'Encountered an error creating a record.', error);
        return callback(error);
      }
      callback(undefined, response.ops);
    });
  },

  /**
   * Used to fetch records from a collection.
   * @param {string} collectionName Indicates the name of the Mongo collection
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
   * @returns {object} a raw connection the the Mongo instance.
   */
  getRawConnection: () => {
    return db;
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
      .update(criteria, updateObject, error => {
        if (error) {
          if (error.message.indexOf('duplicate key error collection') >= 0) {
            Log.info('Mongo Connection', 'Create', `Attempt to create a duplicate entry.\n${error}`);
            return callback(error);
          }
          Log.error('Mongo Connection', 'Create', 'Encountered an error creating a record.', error);
          return callback(error);
        }

        callback(undefined);
      });
  }

};

export default MongoDataSource;
