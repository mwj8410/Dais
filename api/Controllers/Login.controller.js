/* global module, require */

// Required utilities
const log = require('../Utilities/log');

// Required Application Services
const AuthDataSource = require('../Connections/AuthService.datasource');
const MongoDataSource = require('../Connections/Mongo.datasource');

// Internally required values
const collectionName = 'User';

module.exports = {
  login: (credentialValues, callback) => {
    // We can approach this in two different ways, depending on what we want.
    // The most obvious way is to dispatch the credentials to the remote Auth service and allow it to validate
    // them to an account. Then retrieve that User record. The issue with this is that the remote system will log
    // that action as a successful login, even if the account within this service is not active.

    // The second way is to retrieve the User in this service first, then dispatch the Auth request if that record is
    // active. This is the approach we are taking here.

    if (!credentialValues.nameLogin || !credentialValues.password) {
      let error = new Error('Required values not supplied.');
      error.internalCode = 422;
      return callback(error);
    }

    MongoDataSource.get(collectionName, { nameLogin: credentialValues.nameLogin }, (error, users) => {
      let user;
      if (error) {
        return callback(error);
      }
      if (users.length !== 1) {
        let err = new Error('Provided id failed to match exactly one record.');
        err.internalCode = 404; // Will be mapped by the handler to a 401 HTTP status.
        return callback(err);
      }
      user = users[0];

      if (user.active === false) {
        let err = new Error('Provided id corresponds to an inactive resource.');
        err.internalCode = 403;
        return callback(err);
      }

      // The account is valid and can be logged into
      // Now, validate the credentials.
      AuthDataSource.validate(credentialValues, (error, validationProfile) => {
        if (error) {
          return callback(error);
        }
        if (validationProfile.id !== user.id) {
          // The two systems don't agree on who the user is.
          // If this is not an environment mismatch, then something really fishy is happening.
          let err = new Error('Local and remote data sources do not agree on the user\'s id');
          err.internalCode = 500;
          log.security('LoginController', 'login', 'Local and remote data sources do not agree on the user\'s id');
          return callback(err);
        }
        return callback(undefined, user);
      });
    });
  }
};
