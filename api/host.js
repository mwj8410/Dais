/* global module, process, require */

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const log = require('./Utilities/log');

let app = express();
let appConfig;
let server;

module.exports = {
  close: () => {
    server.close();
  },

  getAppInstance: () => app,

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
      res.header('Access-Control-Allow-Origin', appConfig.origins);
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
          app.get(`/${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'POST':
          app.post(`/${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'PUT':
          app.put(`/${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'PATCH':
          app.patch(`/${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'DELETE':
          app.delete(`/${appConfig.baseUrl}${route[0]}`, route[2]);
          break;
        default:
          break;
      }
      log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} /${appConfig.baseUrl}${route[0]}`);
    });
  },

  mountStatic: staticContentPath => {
    app.use('/app/', express.static(staticContentPath));
    log.info('Host', 'mountStatic', `mounted handler static files: '/app/' provides files located at ${staticContentPath}`);
  },

  mountViews: rootRedirectView => {
    app.set('view engine', 'ejs');

    if (rootRedirectView) {
      app.get('/', (req, res) => {
        res.redirect(`/view/${rootRedirectView}/`);
      });
      log.info('Host', 'mountViews', '`/` with redirect to /view/index');
    }

    fs.readdirSync('./views/pages/')
    .filter(contentItem => /^.*\.ejs$/.test(contentItem))
    .forEach(view => {
      const viewName = view.split('.')[0]; // Get the first part of the file name
      app.get(`/view/${viewName}/*`, (req, res) => {
        // TODO: get the path parameters and use any part after the viewName to fetch records
        // from the configured view database.
        return res.render(`pages/${viewName}`);
      });

      log.info('Host', 'mountViews', `\`/view/${viewName}\` to \`./views/pages/${viewName}.ejs\``);
    });

  }
};
