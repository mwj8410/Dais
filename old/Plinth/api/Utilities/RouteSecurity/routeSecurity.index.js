const Log = require('../log');
const StandardResponses = require('../StandardResponses/standardResponses');

// Security Profiles
const loggedIn = require('./loggedIn.security');

const securityProfiles = {
  loggedIn: loggedIn
};

const RouteSecurity = (profiles, handler) => {
  // If no definition is indicated, return the handler ... the route does not use a profile.
  if (!profiles || profiles.length === 0) {
    return handler;
  }

  // This is a little tricky
  // Return a function that has the `profiles` array and the `handler` function in scope
  return (req, res) => {
    let actions = [];

    profiles.forEach((profile) => {
      actions.push(securityProfiles[profile](req));
    });

    Promise.all(actions)
      .then((results) => {
        if (results.indexOf(false) >= 0) {
          Log.security(
            'RouteSecurity',
            'resolver',
            'Request failed security checks.'
            );
          return res.status(401).send(StandardResponses.unAuthorized);
        }
        return handler(req, res);
      })
      .catch((error) => {
        Log.error(
          'RouteSecurity',
          'resolver',
          'Encountered an error while attempting to validate the request.',
          error
        );
        return res.status(401).send(StandardResponses.unAuthorized);
      });
  };
};

module.exports = RouteSecurity;
