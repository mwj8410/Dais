const newman = require('newman');

module.exports.run = (globals, cb) => {
  // Setup

  // Run test set
  newman.run({
    collection: require('./collections/User.postman_collection.json'),
    reporters: 'cli',
    globals: globals
  }, (err, runSummary) => {
    // Cleanup
    // helpers.clearDatabase(() => {

    // Finally
    cb(runSummary.run.failures.length > 0);

    // });
  });
};
