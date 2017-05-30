/* global after, describe, it, require */

const expect = require('expect');
const host = require('../api/host');
const log = require('../api/Utilities/log');

before(done => {
  log.setLevel('silent');
  require('../api/api');
  setTimeout(done, 200);
});

after(() => {
  host.close();
});

describe('Testing Framework', () => {
  it('launches the application for testing', () => {
    expect(true).toBe(true);
  });
});

// API Tests
// Unit
require('./api_unit/User.controller.spec.js');
