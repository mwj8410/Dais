/* global module, process, require */

import bodyParser from 'body-parser';
import express from 'express';

import RouteSecurity from './Utilities/routeSecurity';
import Log from './Utilities/log';

let app = express();
let appConfig;
let server;

export default {
  close: () => {
    server.close();
  },

  getAppInstance: () => app,

  initialize: (config) => {
    if (!config) {
      Log.error('Host', 'initialize', 'The app module requires that a configuration object be provided.');
      return;
    }
    appConfig = config;

    app.use(bodyParser.urlencoded({ extended: true }));
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
      Log.info('Host', 'listen', `listening on port: ${appConfig.port}.`);
    });
  },

  // mountGraphQlRoute: () => {
  //   app.use('/graphql', graphqlHTTP({
  //     schema: schema,
  //     graphiql: true,
  //   }));
  // },

  mountRoutes: routeList => {
    routeList.forEach(route => {
      switch (route[1]) {
        case 'GET':
          app.get(`/${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'POST':
          app.post(`/${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PUT':
          app.put(`/${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PATCH':
          app.patch(`/${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'DELETE':
          app.delete(`/${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        default:
          break;
      }
      Log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} /${route[0]}`);
    });
  }
};
