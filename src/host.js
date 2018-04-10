/* global module */

// Core Modules
const path = require('path')

// Packages
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')

// Internal Modules
const FileAccumulator = require('../lib/FileAccumulator/FileAccumulator')
const Log = require('../lib/Log/Log') // ToDo: move to external module

// Values
const app = express()
let server
let hostConfig

const Host = {
  /**
   * Retrieves the running instance of the Express application. This is mostly needed for unit testing.
   * @return {object} Express application instance.
   */
  getAppInstance: () => app,

  /**
   * Prepares the Express application instance to host the service.
   */
  initialize: (config) => {
    hostConfig = config.get('host')
    // Add Session
    // let sessionSettings = {
    //   key: 'session.sid',
    //   cookie: {
    //     httpOnly: false,
    //     maxAge: 7 * 24 * 3600 * 1000 // Week long cookie
    //   },
    //   resave: true,
    //   saveUninitialized: true,
    //   secret: hostConfig.session.sessionSecret,
    //   store: new MongoStore({
    //     url: `mongodb://${hostConfig.session.url}/${hostConfig.session.database}`
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
      // if (hostConfig.host.origins.includes(origin)) {
      //   res.header('Access-Control-Allow-Origin', origin)
      // }
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })

    Host._mountRoutes(config)
  },

  _mountRoutes: (config) => {
    FileAccumulator([ process.cwd(), config.get('app').paths.requestHandlers].join(path.sep))
    .filter((filePath) => /\.js$/.test(filePath))
    .forEach((handlerPath) => {
      const handler = require(handlerPath)
      // ToDo: Apply precondition validators

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
    // ToDo: add swagger hosting and generation
    // Initialize swagger if the API process is not started in production mode.
    // if (process.env.NODE_ENV !== 'production') {
    //   swagger.initialize(__dirname)
    //   swagger.host(host.getAppInstance())
    // }
    server = app.listen(hostConfig.port, () => {
      Log.notice('Host', 'listen', `listening on port: ${hostConfig.port}.`)
    })
  },

  stop: () => {
    try {
      server.close(() => {
        Log.notice('Host', 'stop', 'server is shut down.')
      })
    } catch (e) {
      // ToDo: log error
    }
  }
}

module.exports = Host
