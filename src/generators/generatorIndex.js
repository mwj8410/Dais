// Core Modules
const fs = require('fs')
const path = require('path')

// External Modules

// Internal Modules
const FileAccumulator = require('../../lib/FileAccumulator/FileAccumulator')
// const FileHelper = require('../../lib/FileHelper/FileHelper.js')
const GeneratorRequestHandler = require('./requestHandler/requestHandler.generator')
const GeneratorTest = require('./test/test.geenrator')
const Log = require('../../lib/Log/Log')

// Runtime Variables
const generatedPathPart = 'generated'

const GenerateorIndex = {

  getDefinitions: (routeHandlerDefinitionPath) => {
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
      // ToDo: construct PhErr error
      console.log(e)
    }
    return routeDefinitions
  },

  generateRestHandlers: (routeDefinitions, workingPath, config) => {
    if (!fs.existsSync(workingPath)) {
      fs.mkdirSync(workingPath)
    }
    if (!fs.existsSync([ workingPath, generatedPathPart ].join(path.sep))) {
      fs.mkdirSync([ workingPath, generatedPathPart ].join(path.sep))
    }

    // Now we need to output the files
    Object.keys(routeDefinitions).forEach((key) => {
      let contents = GeneratorRequestHandler(routeDefinitions[key], config)
      fs.writeFileSync(`${workingPath}/${generatedPathPart}/${key}.js`, contents)
      Log.notice('Plinth', 'Route Handler Generator', `Outputting handler ${key}.`)
    })
  },

  generateTests: (routeDefinitions, workingPath) => {
    if (!fs.existsSync([ workingPath, generatedPathPart ].join(path.sep))) {
      fs.mkdirSync([ workingPath, generatedPathPart ].join(path.sep))
    }

    if (!fs.existsSync([ workingPath, generatedPathPart ].join(path.sep))) {
      fs.mkdirSync([ workingPath, generatedPathPart ].join(path.sep))
    }

    // Now we need to output the files
    Object.keys(routeDefinitions).forEach((key) => {
      let contents = GeneratorTest(routeDefinitions[key])
      fs.writeFileSync(`${workingPath}/generated/${key}.spec.js`, contents)
      Log.notice('Plinth', 'Test Generator', `Outputting Unit Test ${key}.`)
    })
  }
}

module.exports = GenerateorIndex
