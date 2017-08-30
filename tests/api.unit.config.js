/* global after, before, require */
const Log = require('../api/Utilities/log');
Log.setLevel('silent'); // Doing this first

const host = require('../api/host');

before(() => {
  // Required by unit tests to gain access to the express server for request testing
  require('../api/api');
  global.application = host.getAppInstance();
});

// Manually include each test set here
// Utility
require('../api/Connections/Mongo.datasource.spec');
require('../api/Utilities/log.spec');
require('../api/Utilities/typeCheck.spec');

// Controllers - Application Level Logic
require('../api/Controllers/User.controller.spec');

// Handlers - Consumer Interfaces
require('../api/RestHandlers/Login.handler.spec');
require('../api/RestHandlers/User.handler.spec');
