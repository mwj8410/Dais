/* global after, before */
require('babel-polyfill');

import Log from '../api/Utilities/log';
Log.setLevel('silent'); // Doing this first

import host from '../api/host';

before(() => {
  require('../api/api');
  global.application = host.getAppInstance();
});

// Manually include each test set here

