// Core Modules
const fs = require('fs')
const path = require('path')

// External Modules

// Internal Modules
const FileAccumulator = require('../../lib/FileAccumulator/FileAccumulator')
const FileHelper = require('../../lib/FileHelper/FileHelper.js')
const GeneratorRequestHandler = require('./requestHandler/requestHandler.generator')
const Log = require('../../lib/Log/Log')

// Runtime Variables
const generatedPathPart = 'generated'
const restHandlerPathPart = 'routeHandlers'

const GenerateorIndex = {
  generateRestHandlers: (routeHandlerDefinitionPath) => {
    const routeDefinitionFiles = FileAccumulator(routeHandlerDefinitionPath)
      .filter((fileName) => /.js$/.test(fileName))
    const routeDefinitions = {}

    // Read in route definitions
    try {
      routeDefinitionFiles.forEach((file) => {
        let pathParts = file.split(path.sep)
        const handlerKey = pathParts[pathParts.length - 1].split('.')[0]

        routeDefinitions[handlerKey] =  eval(fs.readFileSync(file, 'utf8')) // eslint-disable-line no-eval
      })
    } catch (e) {
      console.log(e)
    }

    let workingPath =FileHelper.pathUp(routeHandlerDefinitionPath)

    if (!fs.existsSync([ workingPath, restHandlerPathPart ].join(path.sep))) {
      fs.mkdirSync([ workingPath, restHandlerPathPart ].join(path.sep))
    }
    if (!fs.existsSync([ workingPath, restHandlerPathPart, generatedPathPart ].join(path.sep))) {
      fs.mkdirSync([ workingPath, restHandlerPathPart, generatedPathPart ].join(path.sep))
    }

    // Now we need to output the files
    Object.keys(routeDefinitions).forEach((key) => {
      let contents = GeneratorRequestHandler(routeDefinitions[key])
      fs.writeFileSync(workingPath + '/routeHandlers/generated/' + key + '.js', contents)
      Log.notice('Plinth', 'Route Handler Generator', `Outputting handler ${key}.`)
    })
  }
}

module.exports = GenerateorIndex
