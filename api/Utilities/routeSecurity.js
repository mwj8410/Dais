/**
 * Specialized service that sits between the express server and the response handlers.
 * The route definition, provides an array of strings that correspond to the keys for
 *
 */

import db from '../Connections/Mongo.datasource';
import * as StandardResponses from './standardResponses';
import Log from './log';

// ToDo: Place in a RouteSecurityProfiles file
const securityProfiles= {
  sourceApi: req => new Promise((resolve, reject) => {
    if (!req.headers['api-token'] || req.headers['api-token'].length !== 64) {
      Log.security('securityProfiles', 'sourceApi', `Unauthorized request with a missing or malformed apiToken from ${req.headers.host}`);
      return resolve(false);
    }

    // the sourceToken and the requesting origin must match in order for the request to be authorized
    db.get(
      'remoteTokens',
      { remoteLocation: req.headers.host, apiToken: req.headers['api-token'] },
      (error, results) => {
        if (error) {
          Log.error('securityProfiles', 'sourceApi', `Unauthorized request with a missing or malformed apiToken from ${req.headers.host}`);
          return resolve(false);
        }
        if (results.length === 0) {
          Log.security('securityProfiles', 'sourceApi', `Unauthorized request from ${req.headers.host}`);
          return resolve(false);
        }

        // Passes validation
        return resolve(true);
      }
    );
  })
};

function RouteSecurity (profiles, handler) {
  // If no definition is indicated, return the handler ... the route does not use a profile.
  if (!profiles || profiles.length === 0) {
    return handler;
  }
  // ToDo: remove the asyn usage. It causes trouble at this moment.

  // This is a little tricky
  // Return a function that has the `profiles` array and the `handler` function in scope
  return (req, res) => {
    /**
     * Runs all indicated validations in a Promise array and returns the existence of a failure as a Promise.
     * @returns {Promise.<boolean>}
     */
    async function validateRequest () {
      // get an array of result booleans
      let validationResults = [...await Promise.all(profiles.map(action => (securityProfiles[action](req))))];
      return !validationResults.indexOf(false) >= 0;
    }

    // Initiate the validation procedures and respond 401 on failures or pass the request off to the handler on passing
    validateRequest()
      .then(passed => {
        if (!passed) {
          return res.status(401).send(StandardResponses.unAuthorized);
        }
        return handler(req, res);
      });
  }
}

export default RouteSecurity;
