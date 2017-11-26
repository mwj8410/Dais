/* global after, before, require */
const Log = require('../lib/Log/Log');
Log.setLevel('silent'); // Doing this first

// const host = require('../api/host');

before(() => {
  // Required by unit tests to gain access to the express server for request testing
  // require('../api/api');
  // global.application = host.getAppInstance();
});

// Manually include each test set here
// ./lib
require('../lib/Log/Log.spec');
