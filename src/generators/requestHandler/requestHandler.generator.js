'use strict'

// Helpers
const getParameterSnippet = (params) => {
  let parameterSnippet = 'const params = [\n'

  let paramBlock = []
  params.forEach((param) => {
    paramBlock.push(`      'hit'`)
  })
  parameterSnippet += paramBlock.join(',\n')

  parameterSnippet += `
    ]\n\n`

  parameterSnippet +=
`    if (params === false) {
      return res.status(422).send()
    }\n`

  return parameterSnippet
}

const getFileHeading = () => {
  return `
/**
 * This file was generated ${(new Date()).toISOString()} by Plinth ${'v0.0.0'}.
 *
 **/

`
}

const generateRouteHandler = function (context) {
  let generatedHandler = getFileHeading()

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
  handler: (req, res) => {
    ${ getParameterSnippet(context.params) }

    return res.status(200).send()
  }\n`

  generatedHandler += '\n}\n'

  return generatedHandler
}

module.exports = generateRouteHandler
