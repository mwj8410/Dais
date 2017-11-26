/* global process, require */

// Libraries
const host = require('./host');
const Log = require('./Utilities/log');
const routes = require('./routes');

const swagger = require('./Utilities/swagger/swagger');

Log.info('Authentication MicroService', 'main', 'startup sequence beginning.');

host.initialize();
host.mountRoutes(routes);
host.connectDataSource();

// Initialize swagger if the API process is not started in production mode.
if (process.env.NODE_ENV !== 'production') {
  swagger.initialize(__dirname);
  swagger.host(host.getAppInstance());
}

host.listen();
