/* global module, process, require */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MongoDataSource = require('./Connections/Mongo.datasource');

const RouteSecurity = require('./Utilities/RouteSecurity/routeSecurity.index');
const Log = require('./Utilities/log');
const config = require('../config/application.config');

let app = express();

module.exports = {

  /**
   * Connects to all automatically connected data sources
   */
  connectDataSource: () => {
    MongoDataSource.connect();
  },

  /**
   * Retrieves the running instance of the Express application. This is mostly needed for unit testing.
   * @return {object} Express application instance.
   */
  getAppInstance: () => app,

  /**
   * Prepares the Express application instance to host the service.
   */
  initialize: () => {
    // Add Session
    let sessionSettings = {
      key: 'session.sid',
      cookie: {
        httpOnly: false,
        maxAge: 7 * 24 * 3600 * 1000 // Week long cookie
      },
      resave: true,
      saveUninitialized: true,
      secret: config.session.sessionSecret,
      store: new MongoStore({
        url: `mongodb://${config.session.url}/${config.session.database}`
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
      // CORS - Send only the origin that matches the request
      let origin = req.headers.origin;
      if (config.host.origins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  },

  /**
   * Instructs the express application to begin listening. Functionally, starts the server.
   */
  listen: () => {
    // Retain a reference to the started application, so it can be closed later.
    app.listen(config.host.port, () => {
      Log.notice('Host', 'listen', `listening on port: ${config.host.port}.`);
    });
  },

  /**
   * Instructs the initialized express application instance to mount the provided routes using associated
   * security handlers and route handlers.
   * @param {Array} routeList List of route objects.
   */
  mountRoutes: (routeList) => {
    routeList.forEach((route) => {
      switch (route[1]) {
        case 'GET':
          app.get(`${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'POST':
          app.post(`${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PUT':
          app.put(`${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'PATCH':
          app.patch(`${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        case 'DELETE':
          app.delete(`${route[0]}`, RouteSecurity(route[3], route[2]));
          break;
        default:
          break;
      }
      Log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} ${route[0]}`);
    });
  }
};
