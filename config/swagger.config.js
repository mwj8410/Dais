import * as Config from './application.config';
const packageRef = require('../package.json');

/**
 * This configuration provides the base structure and values for the swagger documentation engine.
 */

module.exports = {
  swagger: '2.0',
  info: {
    version: packageRef.version,
    title: Config.internalName,
    license: {
      name: packageRef.license
    }
  },
  host: `${Config.api.url}:${Config.api.port}`,
  basePath: Config.api.baseUrl,
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
    // ToDo: refence the application standard response definitions
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
    },
    ServerError: {
      required: [
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
    },
    Unauthorized: {
      required: [
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
