const express = require('express');
const fs = require('fs');
const path = require('path');

const log = require('../log');

const swaggerURIPath = '/swagger';

let swaggerConfig = require('../../../config/swagger.config.js');

const flatten = arr => arr.reduce((acc, val) =>
  acc.concat(Array.isArray(val) ? flatten(val) : val), []);

const walkSync = dir => fs.readdirSync(dir)
  .map(file => fs.statSync(path.join(dir, file)).isDirectory()
    ? walkSync(path.join(dir, file)) : path.join(dir, file).replace(/\\/g, '/'));

module.exports = {
  host: app => {
    log.info('Swagger', 'host', `Mounting '${swaggerURIPath}/discover' and '${swaggerURIPath}/*'.`);
    // Host the Swagger configuration
    app.get(`${swaggerURIPath}/discover` , (req, res) => res.send(swaggerConfig));

    // Host static assets
    app.use(`${swaggerURIPath}/`, express.static(path.join(__dirname, './swagger_ui/')));
  },

  initialize: path => {
    const fileNames = flatten(walkSync(path)).filter(fileName => /\.swagger\.js$/i.test(fileName));
    // collectDefinitionFiles(path);

    fileNames.forEach(definitionFileName => {
      const definition = require(definitionFileName);
      if (definition.paths) {
        Object.keys(definition.paths).forEach(uri => {
          // If the uri is not yet registered in the definition, register it.
          if (typeof swaggerConfig.paths[uri] === 'undefined') {
            swaggerConfig.paths[uri] = {};
          }

          Object.assign(swaggerConfig.paths[uri], definition.paths[uri]);
          log.info('Swagger', 'initialize', `Mounted Swagger path '${uri}' with methods: ${Object.keys(definition.paths[uri])}`);
        });
      }

      // Now, create any model definitions provided
      if (definition.definitions) {
        Object.assign(swaggerConfig.definitions, definition.definitions);
        log.info('Swagger', 'initialize', `Mounted Swagger definitions for: ${Object.keys(definition.definitions)}`);
      }
    });

  }
};
