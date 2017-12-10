/* eslint-disable complexity */
// High complexity is tolerated in parameters() as the work being done here has a specifically high amount
// of conditional logic.
'use strict'

const types = {

  email: () => {
    return true
  },

  uuidv4: (value) => {
    return true // ToDo: get regular expression specific for UUID v4
  }
}

class Validator {
  parameters (model, params, accumulatedErrors) { // eslint-disable-line no-unused-vars
    if (typeof model.length !== 'number') {
      throw new Error('Model must be an array') // Todo: change error creation t use PhErr
    }
    if (model.length === 0) {
      return {}
    }

    let out = {} // ToDo: Will likely cause a deopt. Research. And do we care?
    let errors = []

    for (const def of model) {
      if (typeof params[def.path] === 'undefined') {
        if (def.required === true) {
          errors.push(`Required parameter missing: ${def.path}`)
        }
        continue
      }

      switch (def.type) {
        case 'uuid4':
          if (types.uuidv4(params[def.path])) {
            out[def.path] = params[def.path]
          } else {
            errors.push(`Invalid type for ${def.path}. Expected UUIDv4`)
          }
          break
        case 'integer':
          // attempt to coerce into a number
          // check gt, gte, lt, lte
          break
        case 'date':
          // always require ISO UTC
          break
        case 'string':
          // check pattern, min, max
          out[def.path] = params[def.path]
          break
      }
    } // close for-of

    if (errors.length > 0) {
      const err = new Error('Failed Model Validation')
      err.failures = errors
      throw err
    }

    return out
  }

  bodyConstructor () {
    return {}
  }
}

module.exports = Validator

