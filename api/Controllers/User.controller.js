import MongoDataSource from '../Connections/Mongo.datasource';
const collectionName = 'User';

// In lieu of

const create = (values, callback) => {
  MongoDataSource.create(collectionName, values, (error, newRecord) => {
    // Filter out non-public values
    return callback(undefined, newRecord);
  });
};

export default create;
