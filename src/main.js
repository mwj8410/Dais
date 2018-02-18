/* global module */

// Core Modules
// const path = require('path')

// Packages
const Log = require('../lib/Log/Log') // ToDo: move to external module

// Internal Modules
const host = require('./host')
const PsConfig = require('../lib/Config/Config')
const GeneratorIndex = require('./generators/generatorIndex')
const Validator = require('../lib/Validator/Validator')

// Values
const config = new PsConfig(`${__dirname}/config`)
config.appendDir(`${process.cwd()}/config`)

// let routeDefPath
let routOutPath = [ 'app', 'generated', 'routeHandlers' ].join('/')
// let testOutPath

const Plinth = {

  config,

  /**
   * Initiates the process of scanning a consuming project and producing the specified file types.
   */
  generate: () => {
    Log.info('Plinth', 'generate', 'Project generation process staring.')

    // Get the consuming project root folder
    const rootPath = process.cwd() // process.mainModule.paths[0].split('node_modules')[0].slice(0, -1)
    Log.info('Plinth', 'generate', `Using '${rootPath}' as the project root.`)

    let generateConfig = config.get('generate')

    const definitions = GeneratorIndex.getDefinitions([ rootPath, 'app', 'routeDefs' ].join('/'))

    if (generateConfig.routeHandlers) {
      if (typeof generateConfig.routeHandlers === 'string') {
        // ToDo: support custom paths
        routOutPath = generateConfig.routeHandlers
      }

      Log.info('Plinth', 'generate', `Generating route handlers and outputing into '.${'/' + routOutPath}'.`)
      // now scan the directory...
      GeneratorIndex.generateRestHandlers(definitions, [ rootPath, 'app' ].join('/'))
    }

    if (generateConfig.tests) {
      GeneratorIndex.generateTests(definitions, [ rootPath, 'test' ].join('/'))
    }
  },

  start: () => {
    Log.activity('Plinth', 'start', 'Beginning startup process.')
    host.initialize(config.get('host'))
    host.listen()
  },

  stop: () => {
    host.stop()
  },

  validator: new Validator()

}

module.exports = Plinth
