const Log = require('../log');

const loggedIn = (req) => new Promise((resolve) => {
  // Verify that the session
  if (!req.session.user) {
    Log.security('RouteSecurity', 'loggedIn', `Attempt to access restricted endpoint by: ${req.ip}`);
    return resolve(false);
  }
  return resolve(true);
});

module.exports = loggedIn;
