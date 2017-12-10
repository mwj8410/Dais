/* global module, require */

const TypeCheck = require('../TypeCheck/TypeCheck')

module.exports = {
  /**
   * A lib function for extracting and type transformation of request parameters.
   * @param {object} values the parameters as passed by express
   * @param {Array} whiteList a list of parameter description objects expressing all allowed parameters. `{ valueName: 'label', dataType: 'string', required: true }`
   * @returns {object} constructed from the whitelisted parameters provided
   */
  extract: (values, whiteList) => {
    let output = {}
    let error = false

    whiteList.forEach((item) => {
      if (item.required && typeof values[item.valueName] === 'undefined' ) {
        error = true
      }
      if (typeof values[item.valueName] !== 'undefined') {
        switch (item.dataType) {
          case 'number':
            output[item.valueName] = Number(values[item.valueName])
            break
          case 'date':
            output[item.valueName] = new Date(values[item.valueName])
            break
          case 'uuid4':
            if (TypeCheck(values[item.valueName], item) === false) {
              error = true
            }
            output[item.valueName] = values[item.valueName]
            break
          default:
            output[item.valueName] = values[item.valueName]
        }
      }
    })

    if (error === true) {
      return false
    }

    return output
  }
}
