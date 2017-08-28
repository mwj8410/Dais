/* global module, require */

const Login = require('./RestHandlers/Login.handler');
const User = require('./RestHandlers/User.handler');

module.exports = [

  [ '/login/', 'POST', Login.login, [] ],
  [ '/login/logout', 'POST', Login.logout, [] ],

  [ '/user/:id', 'GET', User.get, [ 'loggedIn' ] ],
  [ '/user/:id', 'DELETE', User.update, [ 'loggedIn' ] ],
  [ '/user/:id', 'PUT', User.update, [ 'loggedIn' ] ],
  [ '/user/', 'POST', User.create, [] ]

];
