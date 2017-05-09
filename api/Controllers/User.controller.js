/* global module, require */

const params = require('../Utilities/params');

const User = require('../Entities/User.entity');

module.exports = {

  create: (req, res) => {
    res.status(401).send();
  },

  get: (req, res) => {
    let values = params.extract(req, [ 'userId' ]);

    if (values) {
    }
    console.log(values);
    res.status(200).send();
  },

  login: (req, res) => {
    let values = params.extract(req, [ 'userId' ]);

    res.status(200).send();
  }
};
