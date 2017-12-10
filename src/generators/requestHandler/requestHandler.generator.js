'use strict'

// External packages
const toSource = require('tosource')

// Internal Modules
const packageUtil = require('../../../lib/Package/package.utility')

// Helpers
const getParameterSnippet = (params, name) => {
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
    paramBlock.push(toSource(param).replace('\n', '')) // ToDo: need a replaceAll()
  })
  parameterSnippet += paramBlock.join(',\n')

  parameterSnippet += `
    ]\n`

  return parameterSnippet
}

const getFileHeading = (context) => {
  return `'use strict'
/**
 * This file was generated ${(new Date()).toISOString()} by Plinth ${packageUtil.getVersion()}.
 **/

const Plinth = require('${packageUtil.getName()}')

const controller = require('${process.cwd()}/app/controllers/${context.controller}').${context.functionName}
// ToDo: add controller path and require by controller name and method

`
}

const generateRouteHandler = function (context) {
  let generatedHandler = getFileHeading(context)

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
      getParameterSnippet(context.routeParams, 'routeParamsModel') : ''
    }
    ${ context.query && context.query.length > 0 ? getParameterSnippet(context.query, 'queryModel') : '' }
    
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
    
    ${ context.routeParams && context.routeParams.length > 0 ?
    `try {
      queryParams = Plinth.validator.parameters(queryModel, req.query, accumulatedErrors)
    } catch (err) {
      accumulatedErrors = accumulatedErrors.concat(err.failures)
    }` : ''}

    // capture all failed validations
    if (accumulatedErrors.length > 0) {
      // ToDo: Log the errors some how
      return res.status(422).send({
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

module.exports = generateRouteHandler
