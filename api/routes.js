/* global module, require */

const Login = require('./RestHandlers/Login.handler');
const User = require('./RestHandlers/User.handler');

module.exports = [

  [ '/login/', 'POST', Login.login, [] ],
  [ '/login/register/claim', 'POST', Login.registerClaim, [] ],
  [ '/login/register/claimValidate', 'POST', Login.registerClaimValidate, [] ],
  [ '/login/logout', 'POST', Login.logout, [] ],
  [ '/login/setPassword', 'POST', Login.setPassword, ['loggedIn'] ],

  [ '/user/:id', 'GET', User.get, [ 'loggedIn' ] ],
  [ '/user/:id', 'DELETE', User.delete, [ 'loggedIn' ] ],
  [ '/user/:id', 'PUT', User.update, [ 'loggedIn' ] ],
  [ '/user/', 'POST', User.create, [] ]

];
