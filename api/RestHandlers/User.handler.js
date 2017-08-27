/* global module, require */

// import { graphql } from 'graphql';

import params from '../Utilities/params';
import * as StandardResponses from '../Utilities/StandardResponses/standardResponses';

// import schema from '../GraphQL/schema.index';

import * as UserController from '../Controllers/User.controller';

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

    console.log(values);

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

    // graphql(schema, '{ user(id:"a") { id, name } }')
    //   .then((response) => {
    //     return res.status(200).send(response);
    //   });
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
