/* global module, require */
const params = require('../Utilities/params');

const User = require('../Entities/User.entity');

module.exports = {

  create: (req, res) => {
    res.status(401).send();
  },

  csrf: () => {
    // use: csurf
  },

  get: (req, res) => {
    const values = params.extract(req, [ 'userId' ]);
    const result = User.getById(Number(values.userId));

    if (!result) {
      return res.status(403).send();
    }
    res.status(200).send(result);
  },

  login: (req, res) => {
    const values = params.extract(req, [ 'user', 'password' ]);
    const user = User.validateByPassword(values.user, values.password);

    if (!user) {
      return res.status(401).send();
    }
    res.status(200).send(user);
  }
};
