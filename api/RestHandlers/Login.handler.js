/* global module, require */

const Log = require('../Utilities/log');
const params = require('../Utilities/params');
const StandardResponses = require('../Utilities/StandardResponses/standardResponses');

const LoginController = require('../Controllers/Login.controller');

module.exports = {

  /**
   * Attempts to validate provided credentials to a User account and initiates a session.
   * @param {object} req Express Request object
   * @param {object} res Express Response object.
   */
  login: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'nameLogin', dataType: 'string', required: true },
      { valueName: 'authPassword', dataType: 'string', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    LoginController.login(values, (error, user) => {
      if (error) {
        if (error.internalCode === 403) {
          return res.status(401).send(StandardResponses.unAuthorized);
        }
        if (error.internalCode === 404) {
          return res.status(401).send(StandardResponses.unAuthorized);
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

  /**
   * Destroys all session data assocaited with the request.
   * @param {object} req Express Request object
   * @param {object} res Express Response object.
   */
  logout: (req, res) => {
    // This route does not require interaction with a controller.
    req.session.destroy(() => {
      return res.status(200).send();
    });
  },

  /**
   * Attempts to send a notification to the email address on file for the user with a validationCode.
   * @param {object} req Express Request object
   * @param {object} res Express Response object.
   */
  registerClaim: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'email', dataType: 'email', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    LoginController.registerClaim(values.email, (error) => {
      if (error) {
        return res.status(500).send(StandardResponses.server);
      }
      return res.status(200).send();
    });
  },

  /**
   * Attempts to process a validation code that has previously been sent to the account.
   * On success, this will create a validated session in the same way the `login` route does.
   * @param {object} req Express Request object
   * @param {object} res Express Response object.
   */
  registerClaimValidate: (req, res) => {
    let values = params.extract(req.query, [
      { valueName: 'token', dataType: 'token', required: true },
      { valueName: 'email', dataType: 'email', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    LoginController.registerClaimValidate(values.email, values.token, (error, user) => {
      if (error) {
        return res.status(500).send(StandardResponses.server);
      }
      req.session.user = user; // Yes, we will want the object
      Log.activity('Login', 'login', `Started session for: ${user.email}`);

      return res.status(200).send(user.id);
    });
  },

  /**
   * Sets the authentication password for the account.
   * @param {object} req Express Request object
   * @param {object} res Express Response object.
   */
  setPassword: (req, res) => {
    let values = params.extract(req.body, [
      // { valueName: 'id', dataType: 'uuid4', required: true },
      // They are tracked in the external authentication system
      { valueName: 'newAuthPassword', dataType: 'string', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }
    let userId = req.session.user.id;

    LoginController.setPassword(userId, values.newAuthPassword, (error, user) => {
      if (error) {
        return res.status(500).send(StandardResponses.server);
      }
      return res.status(200).send(user);
    });
  }

};
