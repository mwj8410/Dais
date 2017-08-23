/* global module, require */

const User = require('./RestHandlers/User.controller');

module.exports = [

  [ '/user/:userId', 'GET', User.get, [] ],
  [ '/user/', 'POST', User.create, [] ],
  [ '/user/login', 'POST', User.login, [] ]

];
