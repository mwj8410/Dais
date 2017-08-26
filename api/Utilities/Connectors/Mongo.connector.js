import MongoDb from 'mongodb';
import DbConfig from '../../../config/connectionSources.config';
import Log from '../log';

let MongoClient = MongoDb.MongoClient;
let openConnections = {};

/**
 * Used internally to establish the actual connection to Mongo
 * @param {string} dbUrl the full URI with DB, user name, and password used to connect to the MongoDb
 * @returns {Promise}
 */
const connectToMongo = (dbUrl) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbUrl, (err, dbInstance) => {
      if (err) {
        Log.error('Mongo', 'Client Startup', `Encountered an error while connecting to the remote resource.\n${err}`);
        return reject(err);
      }
      Log.info('Mongo', 'Client Startup', 'Connected to remote resource.');
      return resolve(dbInstance);
    });
  });
};

/**
 * Used to either retrieve an active connection to the indicated resource if that connection
 * exists already or not.
 *
 * @param {string} connectionName The internal name for the connection
 * @return {Promise} Establishes an open connection to the indicated MongoDb resource
 */
const MongoConnector = (connectionName) => {
  const dbConfig = DbConfig[connectionName];
  const dbUrl = `mongodb://${dbConfig.url}:${dbConfig.port}/${dbConfig.database}`;

  if (openConnections[connectionName]) {
    return openConnections[connectionName];
  }

  return connectToMongo(dbUrl)
    .then(dbConnection => {
      openConnections[connectionName] = dbConnection;
      return dbConnection;
    })
    .catch(error => {
      Log.error('MongoConnector', 'Connector', `Encountered an error while connecting to the remote resource.\n${error}`);
      return error;
    });
};

export default MongoConnector;
