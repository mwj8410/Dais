let ConnectionSources = {
  mongo: {
    url: process.env.MONGO_URL,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE
  }
};

// Process local values
// try {
//   let localConfig = require('./local.config');
//   console.log('hit');
//   Object.keys(localConfig.connectionSources).forEach(configKey => {
//     ConnectionSources[configKey] = Object.assign({}, ConnectionSources[configKey], localConfig.connectionSources[configKey]);
//   });
// } catch (ex) {}

console.log('config is: ', ConnectionSources);

module.exports = ConnectionSources;
