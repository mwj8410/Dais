/* global module, require */

const params = require('../Utilities/params');
const StandardResponses = require('../Utilities/StandardResponses/standardResponses');

const UserController = require('../Controllers/User.controller');

module.exports = {

  create: (req, res) => {
    UserController.create((error, newUser) => {
      if (error) {
        // check the error to see if we can decide what to tell the client
        return res.status(500).send(StandardResponses.server);
      }
      return res.status(200).send(newUser);
    });
  },

  delete: (req, res) => {
    let values = params.extract(req.params, [
      { valueName: 'id', dataType: 'number', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    return res.status(200).send();
  },

  get: (req, res) => {
    let values = params.extract(req.params, [
      { valueName: 'id', dataType: 'number', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    return res.status(200).send();
  },

  login: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'userName', dataType: 'string', required: true },
      { valueName: 'password', dataType: 'string', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    res.status(200).send();
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      return res.status(200).send();
    });
  },

  patch: (req, res) => {
    return res.status(200).send();
  },

  update: (req, res) => {
    return res.status(200).send();
  }
};
