/* global module */

/**
 * Provides a connection into a specific data source using a specified connector.
 */

// ToDo: full unit testing

const Log = require('../Utilities/log');
const request = require('request');

const AuthServiceSource = {
  validate: (credentials, callback) => {
    // ToDo: actually connect and validate
    if (credentials.nameLogin === 'dev-private' && credentials.password === 'Abc123') {
      return callback(undefined, { id: '509d18e0-5f2c-430d-8138-5d3e572c1cd8' });
    }
  }
};

module.exports = AuthServiceSource;
