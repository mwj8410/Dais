/* global module, require */

const params = require('../Utilities/params');

module.exports = {

  create: (req, res) => {
    res.status(200).send();
  },

  get: (req, res) => {
    let values = params.extract(req, ['userId']);

    if (values) {

    }
    console.log(values);
    res.status(200).send();
  },

  login: (req, res) => {
    res.status(200).send();
  }
};
