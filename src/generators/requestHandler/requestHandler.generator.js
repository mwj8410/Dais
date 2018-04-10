'use strict'

// Core Modules
const path = require('path')

// External packages
const toSource = require('tosource')

// Internal Modules
const packageUtil = require('../../../lib/Package/package.utility')

// Runtime Values
const rootPath = process.cwd()

module.exports = generateRequestHandler

function generateRequestHandler (context, config) {
  let generatedHandler = _getFileHeading(context, config)

  generatedHandler += 'module.exports = {\n'

  generatedHandler += `
  method: '${context.method}',
  uri: '${context.route}',
  
  /**
   * \`${context.route}\`
   * Generated Route Handler function.
   * @param {Object} req Express request object.
   * @param {Object} res Express response object.
   **/
  handler: async function handler (req, res) {
    const session = req.session
    ${ context.routeParams && context.routeParams.length > 0 ?
      _getParameterSnippet(context.routeParams, 'routeParamsModel') : ''
    }
    ${ context.query && context.query.length > 0 ? _getParameterSnippet(context.query, 'queryModel') : '' }

    let accumulatedErrors = []
    let body
    let queryParams
    let routeParams

    ${ context.routeParams && context.routeParams.length > 0 ?
    `try {
      routeParams = Plinth.validator.parameters(routeParamsModel, req.params, accumulatedErrors)
    } catch (err) {
      accumulatedErrors = accumulatedErrors.concat(err.failures)
    }` : ''}

    ${ context.query && context.query.length > 0 ?
    `try {
      queryParams = Plinth.validator.parameters(queryModel, req.query, accumulatedErrors)
    } catch (err) {
      accumulatedErrors = accumulatedErrors.concat(err.failures)
    }` : ''}

    // capture all failed validations
    if (accumulatedErrors.length > 0) {
      // ToDo: Log the errors some how
      return res.status(400).send({
        ok: false,
        errors: accumulatedErrors
      })
    }

    let response
    try {
     response = await controller(session, routeParams, queryParams, body)
    } catch (err) {
      console.log(err)
      return res.status(500).send() // ToDo: add response objects
    }

    return res.status(200).send({
      ok: true,
      data: response
    })
  }\n`

  generatedHandler += '\n}\n'

  return generatedHandler
}

// Helpers
function _getParameterSnippet (params, name) {
  let parameterSnippet = `const ${name} = [\n`

  let paramBlock = []
  params.map((param) => {
    return {
      type: param.type,
      path: param.path,
      pattern: param.pattern,
      required: param.required
    }
  }).forEach((param) => {
    paramBlock.push(toSource(param).replace('\n', ''))
  })
  parameterSnippet += paramBlock.join(',\n')

  parameterSnippet += `
    ]\n`

  return parameterSnippet
}

function _getFileHeading (context, config) {
  const controllerPath = [ rootPath, config.get('app').paths.controllers ].join(path.sep)
  return `'use strict'
/**
 * This file was generated ${(new Date()).toISOString()} by Plinth ${packageUtil.getVersion()}.
 **/

const Plinth = require('${packageUtil.getName()}')

const { ${context.functionName}: controller } = require('${controllerPath}/${context.controller}')

`
}
