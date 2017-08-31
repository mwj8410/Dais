/* global module, require */

const log = require('../Utilities/log');
const params = require('../Utilities/params');
const StandardResponses = require('../Utilities/StandardResponses/standardResponses');

const UserController = require('../Controllers/User.controller');

module.exports = {

  create: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'email', dataType: 'email', required: true },

      { valueName: 'nameDisplay', dataType: 'string', required: true },
      { valueName: 'nameFirst', dataType: 'string', required: false },
      { valueName: 'nameLast', dataType: 'string', required: false },
      { valueName: 'nameLogin', dataType: 'string', required: true },

      { valueName: 'dateOfBirth', dataType: 'date', required: false },

      { valueName: 'createdSource', dataType: 'string', required: false }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    UserController.create(values, (error, newUser) => {
      if (error) {
        // check the error to see if we can decide what to tell the client
        if (error.inernalCode && error.inernalCode === 422) {
          return res.status(422).send(StandardResponses.malformed);
        }
        return res.status(500).send(StandardResponses.server);
      }
      return res.status(200).send(newUser);
    });
  },

  delete: (req, res) => {
    let values = params.extract(req.params, [
      { valueName: 'id', dataType: 'uuid4', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    if (req.session.user.type !== 'admin' && req.session.user.id !== values.id) {
      log.security('UserHandler', 'Get', 'Attempt by non-admin to access a restricted record.');
      return res.status(401).send(StandardResponses.unAuthorized);
    }

    return res.status(200).send();
  },

  get: (req, res) => {
    let values = params.extract(req.params, [
      { valueName: 'id', dataType: 'uuid4', required: true }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    if (req.session.user.type !== 'admin' && req.session.user.id !== values.id) {
      log.security('UserHandler', 'Get', 'Attempt by non-admin to access a restricted record.');
      return res.status(401).send(StandardResponses.unAuthorized);
    }

    UserController.get(values.id, false, (error, user) => {
      if (error) {
        if (error.inernalCode === 404) {
          return res.status(404).send(StandardResponses.notFound);
        }
        return res.status(500).send(StandardResponses.server);
      }
      return res.status(200).send(user);
    });
  },

  patch: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'email', dataType: 'email', required: true },
      { valueName: 'nameDisplay', dataType: 'string', required: true },
      { valueName: 'nameFirst', dataType: 'string', required: false },
      { valueName: 'nameLast', dataType: 'string', required: false },
      { valueName: 'dateOfBirth', dataType: 'date', required: false }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    if (Object.keys(values).length !== 1) {
      return res.status(422).send(StandardResponses.malformed);
    }

    if (req.session.user.type !== 'admin' && req.session.user.id !== values.id) {
      log.security('UserHandler', 'Get', 'Attempt by non-admin to access a restricted record.');
      return res.status(401).send(StandardResponses.unAuthorized);
    }

    return res.status(200).send();
  },

  update: (req, res) => {
    let values = params.extract(req.body, [
      { valueName: 'email', dataType: 'email', required: true },
      { valueName: 'nameDisplay', dataType: 'string', required: true },
      { valueName: 'nameFirst', dataType: 'string', required: false },
      { valueName: 'nameLast', dataType: 'string', required: false },
      { valueName: 'dateOfBirth', dataType: 'date', required: false }
    ]);

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }

    if (req.session.user.type !== 'admin' && req.session.user.id !== values.id) {
      log.security('UserHandler', 'Get', 'Attempt by non-admin to access a restricted record.');
      return res.status(401).send(StandardResponses.unAuthorized);
    }

    return res.status(200).send();
  }

};
