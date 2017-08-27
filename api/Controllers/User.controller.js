const MongoDataSource = require('../Connections/Mongo.datasource');
const collectionName = 'User';

// In lieu of an Entity/Model framework, we'll fake it

module.exports = {
  create: (values, callback) => {
    MongoDataSource.create(collectionName, values, (error, newRecord) => {
      // Filter out non-public values
      return callback(undefined, newRecord);
    });
  }
};
