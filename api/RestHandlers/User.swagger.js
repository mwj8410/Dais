module.exports = {
  paths: {
    '/user': {
      post: {
        summary: 'Create a new user record',
        operationId: 'createUser',
        tags: [ 'user' ],
        parameters: [
          {
            name: 'sourceToken',
            in: 'formData',
            description: 'A token used to validate the sending origin.',
            required: true,
            type: 'string',
            default: '1234567812345678123456781234567812345678123456781234567812345678'
          },
          {
            name: 'credential',
            in: 'formData',
            description: 'A token used to validate the sending origin.',
            required: true,
            type: 'string',
            default: 'user@test.com'
          },
          {
            name: 'passCode',
            in: 'formData',
            description: 'A pass code that is presumed to be associated with the id provided.',
            required: true,
            type: 'string',
            default: 'user@test.com'
          }
        ],
        responses: {
          200: {
            description: 'The information contained in the request passed authentication and resolved to a user universal id.',
            schema: {
              $ref: '#/definitions/PersonId'
            }
          },
          401: {
            description: 'The requesting system is not authorized to make requests with this service.',
            schema: {
              $ref: '#/definitions/Unauthorized'
            }
          },
          404: {
            description: 'The credentials provided did not map to any credential on record.',
            schema: {
              $ref: '#/definitions/Error'
            }
          },
          409: {
            description: 'The entity described in the request is refused.',
            schema: {
              $ref: '#/definitions/Error'
            }
          },
          422: {
            description: 'The request is valid, but incomplete or incorrect in some way.',
            schema: {
              $ref: '#/definitions/Error'
            }
          },
          500: {
            description: 'There has been an internal error that cannot be resolved.',
            schema: {
              $ref: '#/definitions/ServerError'
            }
          },
          default: {
            description: 'unexpected error',
            schema: {
              $ref: '#/definitions/Error'
            }
          }
        }
      }
    }
  },
  definitions: {
    PersonId: {
      required: [ 'id' ],
      properties: {
        id: {
          type: 'string'
        }
      }
    }
  }
};
