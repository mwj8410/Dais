/* global after, before */
require('babel-polyfill');

import Log from '../api/Utilities/log';
Log.setLevel('silent'); // Doing this first

import host from '../api/host';

before(() => {
  // Required by unit tests to gain access to the express server for request testing
  require('../api/api');
  global.application = host.getAppInstance();
});

// Manually include each test set here
require('../api/Connections/Mongo.datasource.spec');

