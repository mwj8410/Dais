/* global after, before */
const Log = require('../api/Utilities/log');
Log.setLevel('silent'); // Doing this first

const host = require('../api/host');

before(() => {
  // Required by unit tests to gain access to the express server for request testing
  require('../api/api');
  global.application = host.getAppInstance();
});

// Manually include each test set here
require('../api/Connections/Mongo.datasource.spec');

