/* global process, require */
// Libraries
const host = require('./host');
const log = require('./Utilities/log');
const routes = require('./routes');

const apiConfig = require('../config/application.config').api;
const swagger = require('../utility/swagger/swagger');

log.info('API', 'main', 'startup sequence beginning.');

host.initialize(apiConfig);
host.mountRoutes(routes);
host.mountStatic('./.tmp/');

// Initialize swagger if the API process is not started in production mode.
if (process.env.NODE_ENV !== 'production') {
  swagger.initialize(__dirname);
  swagger.host(host.getAppInstance());
}

host.listen();
