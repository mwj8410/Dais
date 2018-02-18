/* global module */

// Core Modules
const path = require('path')

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

const rootPath = process.cwd()
const routeDefinitionPath = [ rootPath, config.get('app').paths.routeDef ].join(path.sep)
const requestHandlerPath = [ rootPath, config.get('app').paths.requestHandlers ].join(path.sep)
const unitTestPath = [ rootPath, config.get('app').paths.unitTests ].join(path.sep)

const Plinth = {

  config,

  /**
   * Initiates the process of scanning a consuming project and producing the specified file types.
   */
  generate: () => {
    Log.info('Plinth', 'generate', 'Project generation process staring.')

    // Get the consuming project root folder
    Log.info('Plinth', 'generate', `Using '${rootPath}' as the project root.`)

    const generateConfig = config.get('generate')

    const definitions = GeneratorIndex.getDefinitions(routeDefinitionPath)

    if (generateConfig.routeHandlers) {
      Log.info('Plinth', 'generate', `Generating route handlers and outputing into '${requestHandlerPath}'`)
      // now scan the directory...
      GeneratorIndex.generateRestHandlers(definitions, requestHandlerPath, config)
    }

    if (generateConfig.tests) {
      GeneratorIndex.generateTests(definitions, unitTestPath)
    }
  },

  start: () => {
    Log.activity('Plinth', 'start', 'Beginning startup process.')
    host.initialize(config)
    host.listen()
  },

  stop: () => {
    host.stop()
  },

  validator: new Validator()
}

module.exports = Plinth
