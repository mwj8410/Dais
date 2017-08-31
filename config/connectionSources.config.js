/* global module */

let ConnectionSources = {
  authService: {
    url: process.env.AUTH_SERVICE_URL,
    apiToken: process.env.AUTH_SERVICE_API_TOKEN
  },
  mongo: {
    url: process.env.MONGO_URL,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE
  }
};

// Process local values
try {
  let localConfig = require('./local.config');
  Object.keys(localConfig.connectionSources).forEach((configKey) => {
    ConnectionSources[configKey] = Object.assign({}, ConnectionSources[configKey], localConfig.connectionSources[configKey]);
  });
} catch (ex) {}

module.exports = ConnectionSources;
