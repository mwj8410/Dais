/* global after, describe, it, require */

const expect = require('expect');
// const host = require('../api/host');
const log = require('../api/Utilities/log');

const testRuns = [
  require('./api_e2e/User.spec.js')
];

setTimeout(() => {
  log.setLevel('silent');
  require('../api/api');

  setTimeout(() => {
    const nextTest = (tests, hasFailed) => {
      if (tests.length === 0) {
        return setTimeout(() => {
          process.exit(hasFailed ? 1 : 0);
        }, 500);
      }
      tests.shift().run({
        api_url: 'localhost:24601'
      }, failed => {
        return nextTest(tests, hasFailed || failed);
      });
    };
    nextTest(testRuns, false);
  }, 200);
}, 200);
