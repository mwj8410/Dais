/* global module, process, require */

import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';

import RouteSecurity from './Utilities/RouteSecurity/routeSecurity.index';
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
    console.log(appConfig);

    // Add Session
    // ToDo: connect a session data store ... likely Mongo
    let sessionsettings = {
      secret: appConfig.sessionSecret,
      cookie: {},
      resave: false,
      saveUninitialized: true
    };

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1); // trust first proxy
      sessionsettings.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sessionsettings));
    // Finish Session

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
          app.get(`/rest${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'POST':
          app.post(`/rest${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PUT':
          app.put(`/rest${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PATCH':
          app.patch(`/rest${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'DELETE':
          app.delete(`/rest${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        default:
          break;
      }
      Log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} /rest${route[0]}`);
    });
  }
};
