/* global module, process, require */

const bodyParser = require('body-parser');
const express = require('express');
const log = require('./Utilities/log');

let app = express();
let appConfig;
let server;

module.exports = {
  close: () => {
    server.close();
  },

  initialize: config => {
    if (!config) {
      log.error('Host', 'initialize', 'The app module requires that a configuration object be provided.');
      return;
    }
    appConfig = config;

    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use((req, res, next) => {
      // These need to be made available in configuration
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

  },

  listen: () => {
    // Retain a reference to the started application, so it can be closed later.
    server = app.listen(appConfig.port, () => {
      log.info('Host', 'listen', `listening on port: ${appConfig.port}.`);
    });
  },

  mountRoutes: routeList => {
    routeList.forEach(route => {
      switch (route[1]) {
        case 'GET':
          app.get(`${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'POST':
          app.post(`${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'PUT':
          app.put(`${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'PATCH':
          app.patch(`${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'DELETE':
          app.delete(`${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        default:
          break;
      }
      log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} ${route[0]}`);
    });
  },

  mountStatic: staticContentPath => {
    console.log();
    app.use('/app/', express.static(staticContentPath));
    app.get('/', (req, res) => {
      res.redirect('/app/index.html');
    });
    log.info('Host', 'mountStatic', `mounted handler static files: '/app/' provides files located at ${staticContentPath}`);
  }
};
