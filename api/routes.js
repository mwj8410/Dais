/* global module, require */

const User = require('./Controllers/User.controller');
const Workspace = require('./Controllers/Workspace.controller');

module.exports = [

  [ '/user/:userId', 'GET', User.get ],

  [ '/workspace/:workspaceId', 'GET', Workspace.get ],
  [ '/workspace/by-user/:userId', 'GET', Workspace.getByUser ],
  [ '/workspace', 'POST', Workspace.create ],
  [ '/workspace/:workspaceId', 'PUT', Workspace.update ]
];
