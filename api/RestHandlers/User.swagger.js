module.exports = {
  paths: {
    '/user': {
      post: {
        summary: 'Create a new user record',
        operationId: 'createUser',
        tags: [ 'user' ],
        parameters: [
          {
            name: 'email',
            in: 'formData',
            description: 'The email address associated with the account',
            required: true,
            type: 'string',
            default: 'user@test.com'
          },
          {
            name: 'nameDisplay',
            in: 'formData',
            description: 'The publicly visible name for the user',
            required: true,
            type: 'string',
            default: 'dev-public'
          },
          {
            name: 'nameLogin',
            in: 'formData',
            description: 'The name used to identify the account.',
            required: true,
            type: 'string',
            default: 'dev-private'
          },
          {
            name: 'nameFirst',
            in: 'formData',
            description: 'The user\'s first name',
            required: false,
            type: 'string',
            default: 'Developer'
          },
          {
            name: 'nameLast',
            in: 'formData',
            description: 'The user\'s last name',
            required: false,
            type: 'string',
            default: 'test'
          },
          {
            name: 'dateOfBirth',
            in: 'formData',
            description: 'The user\'s last name',
            required: false,
            type: 'string',
            format: 'date',
            default: '1981-09-28'
          },
          {
            name: 'createdSource',
            in: 'formData',
            description: 'The name of the system, integration, or process that is creating the record',
            required: false,
            type: 'string',
            default: 'self'
          }
        ],
        responses: {
          200: {
            description: 'The information contained in the request passed authentication and resolved to a user universal id.'
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
  }
};
