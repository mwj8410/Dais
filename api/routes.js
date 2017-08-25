/* global module, require */

const User = require('./RestHandlers/User.handler');

module.exports = [

  [ '/user/:id', 'GET', User.get, [] ],
  [ '/user/:id', 'DELETE', User.update, [] ],
  [ '/user/', 'POST', User.create, [] ],
  [ '/user/:id', 'PUT', User.update, [] ]

];
