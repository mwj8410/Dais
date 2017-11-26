/* global module, require */

const async = require('async');
const moment = require('moment');

// Required utilities
const log = require('../Utilities/log');
const passwordService = require('../Utilities/password');

// Required Application Services
const MandrillService = require('../Connections/Mandrill.service');
const MongoDataSource = require('../Connections/Mongo.datasource');
const UserController = require('./User.controller');

// Internally required values
const collectionName = 'User';
const publicUrl = require('../../config/application.config').host.url;

module.exports = {

  /**
   * Validates supplied credentials against available records and returns the account
   * @param {object} credentialValues the perspective login name and password for an account.
   * @param {function} callback Error first method called with the results of the operation.
   */
  login: (credentialValues, callback) => {
    // We can approach this in two different ways, depending on what we want.
    // The most obvious way is to dispatch the credentials to the remote Auth service and allow it to validate
    // them to an account. Then retrieve that User record. The issue with this is that the remote system will log
    // that action as a successful login, even if the account within this service is not active.

    // The second way is to retrieve the User in this service first, then dispatch the Auth request if that record is
    // active. This is the approach we are taking here.

    if (!credentialValues.nameLogin || !credentialValues.authPassword) {
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

      if (user.active === false || typeof user.authPassword === 'undefined') {
        let err = new Error('Provided id corresponds to an inactive resource.');
        err.internalCode = 403;
        return callback(err);
      }

      if (passwordService.hashPassword(credentialValues.authPassword, user.authSalt) !== user.authPassword) {
        let authErr = new Error();
        authErr.internalCode = 401;
        log.security('Login Controller', 'Login', 'There has been a failed login attempt.');
        return callback(authErr);
      }

      return callback(undefined, user);
    });
  },

  /**
   * Registers an existing User record or creates a new User record for the provided email address and initiates the email validation process.
   * @param {string} email The new user's email address.
   * @param {function} callback Error first method called once the operation has completed.
   */
  registerClaim: (email, callback) => {
    // First, retrieve any existing User record
    let registrationToken = passwordService.createToken(8);

    async.auto(
      {
        getUserRecord: function (next) {
          MongoDataSource.get(collectionName, { email: email }, (error, users) => {
            if (error) {
              log.error('Login Controller', 'registerClaim', 'Encountered an error while getting User.', error);
              return callback(error);
            }

            // If we don't already have a User record, then create it
            if (users.length === 0) {
              // The user does not exist, create a new record, but keep it inactive
              UserController.create(
                {
                  email: email,
                  active: false,
                  createdSource: 'selfRegistration'
                },
                (error, user) => {
                  if (error) {
                    log.error('Login Controller', 'registerClaim', 'Encountered an error while creating User.', error);
                    return next(error);
                  }
                  return next(undefined, user);
                });
            } else {
              // The User record already exists
              let user = users[0];
              if (user.active === true) {
                log.security('Login Controller', 'registerClaim', 'Attempt to register an already existing and active User.');
                let newError = new Error('Attempt to register an already existing and active User.');
                newError.internalCode = 401;
                return next(newError);
              }

              return next(undefined, user);
            }
          });
        },
        dispatchEmail: [ 'getUserRecord', function (values, next) {
          MandrillService.send(
            'verifyEmail',
            email,
            {
              baseUrl: publicUrl,
              registrationToken: registrationToken,
              email: email
            },
            (error) => {
              if (error) {
                return next(error);
              }
              return next();
            });
        } ],
        // We update the user after the email is dispatched so we don't get locked into an irrecoverable state with the user record.
        updateUser: [ 'dispatchEmail', function (values, next) {
          const user = values.getUserRecord;
          user.authRegistrationToken = registrationToken;
          user.authRegistrationTokenDate = new Date();

          MongoDataSource.update(collectionName, { id: user.id }, user, (error, user) => {
            if (error) {
              log.error('Login Controller', 'registerClaim', 'Encountered an error sending email.', error);
              return next(error);
            }
            return next(undefined, user);
          });
        } ],

      },
      (error, values) => {
        if (error) {
          if (error.internalCode) {
            return callback(error);
          }
          log.error('Login Controller', 'registerClaim', 'Encountered an unknown error in the registration process.', error);
          return callback(error);
        }
        return callback(undefined, values.updateUser);
      }
    );
  },

  registerClaimValidate: (email, token, callback) => {
    const criteria = {
      email: email,
      authRegistrationToken: token
    };

    async.auto(
      {
        getUserRecord: function (next) {
          MongoDataSource.get(collectionName, criteria, (error, users) => {
            let user;
            if (error) {
              log.error('Login Controller', 'registerClaimValidate', 'Encountered an error while getting User.', error);
              return next(error);
            }
            if (users.length !== 1) {
              log.security('Login Controller', 'registerClaimValidate', 'Attempt to claim using a mismatching email and token.');
              return next(error);
            }
            user = users[0];

            // If the token was generated more that 24 hours ago
            // Not the lessThan sign is checking that the negative milliseconds represents a more negative number
            // than the inverse of 24 hours of milliseconds
            if (moment(user.authRegistrationTokenDate).diff(new Date()) < -(24 * 60 * 60 * 1000)) {
              log.notice('Login Controller', 'registerClaimValidate', 'Attempt to claim using an expired token.');
              return next(error);
            }

            return next(undefined, user);
          });
        },
        updateUser: [ 'getUserRecord', function (values, next) {
          const user = values.getUserRecord;
          delete user.authRegistrationToken;
          delete user.authRegistrationTokenDate;
          user.active = true;

          MongoDataSource.update(collectionName, { id: user.id }, user, (error, user) => {
            if (error) {
              log.error('Login Controller', 'registerClaim', 'Encountered an error sending email.', error);
              return next(error);
            }
            return next(undefined, user);
          });
        } ]
      },
      (error, values) => {
        if (error) {
          if (error.internalCode) {
            return callback(error);
          }
          log.error('Login Controller', 'registerClaim', 'Encountered an unknown error in the registration process.', error);
          return callback(error);
        }
        log.activity('LoginController', 'registerClaimValidate', 'User claimed.');
        return callback(undefined, values.updateUser[0]);
      }
    );
  },

  /**
   * Sets or changes the password for the indicated User record.
   * @param {string} userId UUID identifying the account.
   * @param {string} newPassword password to set as the current active password.
   * @param {function} callback Error first method called with the results of the operation.
   */
  setPassword: (userId, newPassword, callback) => {
    const validationResult = passwordService.validate(newPassword);
    let values = {};

    if (validationResult.valid === false) {
      return callback(new Error(`Password does not pass requirements.\n${validationResult.errors.join(' ')}`));
    }

    values.authSalt =  passwordService.createSalt();
    values.authPassword = passwordService.hashPassword(newPassword, values.authSalt);

    MongoDataSource.update(collectionName, { id: userId }, values, (error, users) => {
      if (error) {
        return callback(error);
      }
      let user = users[0];

      return callback(undefined, user);
    });
  }

};
