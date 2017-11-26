/* global module */

// Core Modules

// Packages
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')

// Internal Modules
const FileAccumulator = require('../lib/FileAccumulator/FileAccumulator')
const Log = require('../lib/Log/Log') // ToDo: move to external module

// Values
const app = express()
let config

const Host = {
  /**
   * Retrieves the running instance of the Express application. This is mostly needed for unit testing.
   * @return {object} Express application instance.
   */
  getAppInstance: () => app,

  /**
   * Prepares the Express application instance to host the service.
   */
  initialize: (configuration) => {
    config = configuration
    // Add Session
    // let sessionSettings = {
    //   key: 'session.sid',
    //   cookie: {
    //     httpOnly: false,
    //     maxAge: 7 * 24 * 3600 * 1000 // Week long cookie
    //   },
    //   resave: true,
    //   saveUninitialized: true,
    //   secret: config.session.sessionSecret,
    //   store: new MongoStore({
    //     url: `mongodb://${config.session.url}/${config.session.database}`
    //   })
    // }

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1) // trust first proxy
      // sessionSettings.cookie.secure = true // serve secure cookies
    }
    // app.use(session(sessionSettings))
    // Finish Session

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.text())
    app.use((req, res, next) => {
      // CORS - Send only the origin that matches the request
      let origin = req.headers.origin
      // if (config.host.origins.includes(origin)) {
      //   res.header('Access-Control-Allow-Origin', origin)
      // }
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })

    Host._mountRoutes()
  },

  _mountRoutes: () => {
    // console.log('hit')
    // console.log(
    FileAccumulator(process.cwd() + '/app/routeHandlers/')
    .filter((filePath) => /\.js$/.test(filePath))
    .forEach((handlerPath) => {
      const handler = require(handlerPath)
      // ToDo: Apply precondition validators
      // console.log(handler)

      switch (handler.method) {
        case 'GET':
          app.get(handler.uri, handler.handler)
          break
        // ToDo extend to POST, PUT, PATCH, UPDATE, DELETE
      }

      Log.info('Host', 'mountRoutes', `mounted handler for: ${handler.method} ${handler.uri}`)
    })
    // )
  },

  /**
   * Instructs the express application to begin listening. Functionally, starts the server.
   */
  listen: () => {
    // Retain a reference to the started application, so it can be closed later.
    app.listen(config.port, () => {
      Log.notice('Host', 'listen', `listening on port: ${config.port}.`)
    })
  },
}

module.exports = Host;
