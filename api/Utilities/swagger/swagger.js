import express from 'express';
import fs from 'fs';
import path from 'path';

import Log from '../log';

const swaggerURIPath = '/swagger';

let swaggerConfig = require('../../../config/swagger.config.js');

const flatten = arr => arr.reduce((acc, val) =>
  acc.concat(Array.isArray(val) ? flatten(val) : val), []);

const walkSync = dir => fs.readdirSync(dir)
  .map(file => fs.statSync(path.join(dir, file)).isDirectory()
    ? walkSync(path.join(dir, file)) : path.join(dir, file).replace(/\\/g, '/'));

const Swagger = {
  host: app => {
    Log.info('Swagger', 'host', `Mounting '${swaggerURIPath}/discover' and '${swaggerURIPath}/*'.`);
    // Host the Swagger configuration
    app.get(`${swaggerURIPath}/discover` , (req, res) => res.send(swaggerConfig));

    // Host static assets
    app.use(`${swaggerURIPath}/`, express.static(path.join(__dirname, './swagger_ui/')));
  },

  initialize: path => {
    const fileNames = flatten(walkSync(path)).filter(fileName => /\.swagger\.js$/i.test(fileName));

    fileNames.forEach(definitionFileName => {
      const definition = require(definitionFileName);

      if (definition.default && definition.default.paths) {
        Object.keys(definition.default.paths).forEach(uri => {
          // If the uri is not yet registered in the definition, register it.
          if (typeof swaggerConfig.paths[uri] === 'undefined') {
            swaggerConfig.paths[uri] = {};
          }

          Object.assign(swaggerConfig.paths[uri], definition.default.paths[uri]);
          Log.info('Swagger', 'initialize', `Mounted Swagger path '${uri}' with methods: ${Object.keys(definition.default.paths[uri])}`);
        });
      }

      // Now, create any model definitions provided
      if (definition.default.definitions) {
        Object.assign(swaggerConfig.definitions, definition.default.definitions);
        Log.info('Swagger', 'initialize', `Mounted Swagger definitions for: ${Object.keys(definition.default.definitions)}`);
      }
    });

  }
};

export default Swagger;
