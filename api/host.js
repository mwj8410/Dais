/* global module, process, require */

import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
const MongoStore = require('connect-mongo')(session);

import RouteSecurity from './Utilities/RouteSecurity/routeSecurity.index';
import Log from './Utilities/log';
import * as Config from '../config/application.config';

let app = express();
let server;

export default {
  close: () => {
    server.close();
  },

  getAppInstance: () => app,

  initialize: () => {
    // Add Session
    // ToDo: connect a session data store ... likely Mongo
    let sessionSettings = {
      cookie: {},
      resave: false,
      saveUninitialized: true,
      secret: Config.Session.sessionSecret,
      store: new MongoStore({
        url: `mongodb://${Config.Session.url}/?authSource=${Config.Session.database}&w=1`
      })
    };

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1); // trust first proxy
      sessionSettings.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sessionSettings));
    // Finish Session

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use((req, res, next) => {
      // These need to be made available in configuration
      res.header('Access-Control-Allow-Origin', Config.api.origins);
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  },

  listen: () => {
    // Retain a reference to the started application, so it can be closed later.
    server = app.listen(Config.api.port, () => {
      Log.notice('Host', 'listen', `listening on port: ${Config.api.port}.`);
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
