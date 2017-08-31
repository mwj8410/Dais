/* global module, require */

const Log = require('../Utilities/log');
const params = require('../Utilities/params');
const StandardResponses = require('../Utilities/StandardResponses/standardResponses');

const LoginController = require('../Controllers/Login.controller');

module.exports = {
  login: (req, res) => {
    let values = params.extract(req.body, [
      // neither of these values refer to anything directly on the model.
      // They are tracked in the external authentication system
      { valueName: 'nameLogin', dataType: 'string', required: true },
      { valueName: 'password', dataType: 'string', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    LoginController.login(values, (error, user) => {
      if (error) {
        if (error.internalCode === 403) {
          return res.status(401).send(StandardResponses.notFound);
        }
        if (error.internalCode === 404) {
          return res.status(401).send(StandardResponses.notFound);
        }
        if (error.internalCode === 422) {
          return res.status(422).send(StandardResponses.malformed);
        }
        if (error.internalCode === 500) {
          return res.status(500).send(StandardResponses.server);
        }
      }
      req.session.user = user; // Yes, we will want the object
      Log.activity('Login', 'login', `Started session for: ${values.nameLogin}`);

      res.status(200).send({ id: user.id });
    });
  },

  logout: (req, res) => {
    // This route does not require interaction with a controller.
    req.session.destroy(() => {
      return res.status(200).send();
    });
  }
};
