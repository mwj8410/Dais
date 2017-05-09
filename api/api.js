/* global process, require */

const host = require('./host');
const log = require('./Utilities/log');
const routes = require('./routes');

log.info('API', 'main', 'startup sequence beginning.');

// TODO: move config onto environment to expose it to docker configuration
host.initialize({
  port: 24601,
  baseUrl: ''
});
host.mountRoutes(routes);
host.mountStatic('./.tmp/');
host.listen();
