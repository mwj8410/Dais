/* global module, require */

const User = require('./RestHandlers/User.handler');

module.exports = [

  [ '/user/:id', 'GET', User.get, [ 'loggedIn' ] ],
  [ '/user/:id', 'DELETE', User.update, [ 'loggedIn' ] ],
  [ '/user/:id', 'PUT', User.update, [ 'loggedIn' ] ],
  [ '/user/', 'POST', User.create, [] ],
  [ '/user/login', 'POST', User.login, [] ]

];
