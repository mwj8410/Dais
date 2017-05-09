/* global module, require */

const params = require('../Utilities/params');

const User = require('../Entities/User.entity');

module.exports = {

  create: (req, res) => {
    res.status(401).send();
  },

  get: (req, res) => {
    let values = params.extract(req, [ 'userId' ]);

    const result = User.getById(Number(values.userId));
    if (!result) {
      return res.status(403).send();
    }
    res.status(200).send(result);
  },

  login: (req, res) => {
    let values = params.extract(req, [ 'userId' ]);
    // validate user
    res.status(200).send(values);
  }
};
