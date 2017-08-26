import Log from '../log';

// ToDo install `npm install csrf`
// Generate a token
// save it to the session
// save the secret to the session

const csrf = req => new Promise((resolve) => {
  // There is a provided csrf-token
  if (!req.headers['x-csrf-token']) {
    return resolve(false);
  }

  // The request has a session
  if (!req.session || !req.session.csrf) {
    return resolve(false);
  }

  if (req.session.csrf !== req.headers['x-csrf-token']) {
    Log.security('RouteSecurity', 'csrf', `Mismatched CSRF token in request:\n${req.headers.host}`);
    return resolve(false);
  }

});

export default csrf;
