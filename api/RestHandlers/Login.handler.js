/* global module, require */

const Log = require('../Utilities/log');
const params = require('../Utilities/params');
const StandardResponses = require('../Utilities/StandardResponses/standardResponses');

module.exports = {
  login: (req, res) => {
    let values = params.extract(req.body, [
      // neither of these values refer to anything directly on the model.
      // They are tracked in the external authentication system
      { valueName: 'userName', dataType: 'string', required: true },
      { valueName: 'password', dataType: 'string', required: true }
    ]);

    // ToDo: create and interact with the login controller and connection

    if (values === false) {
      return res.status(422).send(StandardResponses.malformed);
    }
    Log.activity('Login', 'login', `Started session for: ${values.userName}`);
    res.status(200).send();
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      return res.status(200).send();
    });
  }
};
