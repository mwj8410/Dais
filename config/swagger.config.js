const appConfig = require('./application.config');
const packageRef = require('../package.json');

/**
 * This configuration provides the base structure and values for the swagger documentation engine.
 */

module.exports = {
  swagger: '2.0',
  info: {
    version: packageRef.version,
    title: appConfig.internalName,
    license: {
      name: packageRef.license
    }
  },
  host: 'petstore.swagger.io', // TODO: correct
  basePath: appConfig.api.baseUrl,
  schemes: [ 'http' ],
  consumes: [ 'application/json' ],
  produces: [ 'application/json' ],

  // Populated dynamically in the swagger initialization process.
  paths: {},

  // Populated dynamically in the swagger initialization process.
  definitions: {

    // Any definition listed here should be considered applicable for global use. Standard response objects that are used
    // across the API portion should be described here, while module specific patterns should be described in the
    // corresponding module.
    Error: {
      required: [
        'code',
        'message'
      ],
      properties: {
        code: {
          type: 'integer',
          format: 'int32'
        },
        message: {
          type: 'string'
        }
      }
    }
  }
};
