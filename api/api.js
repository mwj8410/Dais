/* global process, require */

const host = require('./host');
const log = require('./Utilities/log');
const routes = require('./routes');

// Construct configuration object
// TODO:
let config = require('../config/production.config');
try {
  // Overwrite production with local config values where present
  let localTemplateConfig = require('../config/local.config');
  config = Object.assign(config, localTemplateConfig);
} catch (ex) {
  log.error('API', 'main', 'configuration failed.');
}

log.info('API', 'main', 'startup sequence beginning.');

host.initialize(config.host);
host.mountRoutes(routes);
host.listen();
