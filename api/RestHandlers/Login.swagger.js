module.exports = {
  paths: {
    '/login': {
      post: {
        summary: 'Attempts to resolve a username and password to a global user id and creates a session.',
        operationId: 'login',
        tags: [ 'login' ],
        parameters: [
          {
            name: 'nameLogin',
            in: 'formData',
            description: 'The unique login name for the account. Not the display name or email address.',
            required: true,
            type: 'string',
            default: 'test@email.com'
          },
          {
            name: 'authPassword',
            in: 'formData',
            description: 'A pass code that is presumed to be associated with the provided loginName.',
            required: true,
            type: 'string',
            default: 'Abc123'
          }
        ],
        responses: {
          200: {
            description: 'The information contained in the request passed authentication and resolved to a user universal id.',
            // no Schema
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
    },
    '/login/logout': {
      post: {
        summary: 'Destroys any session associated with the request.',
        operationId: 'logout',
        tags: [ 'login' ],
        responses: {
          200: {
            description: 'All session data associated with the request is destroyed.'
            // no Schema
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
    },
    '/login/register/claim': {
      post: {
        summary: 'Attempts to claim an account by email address',
        operationId: 'registerClaim',
        tags: [ 'login' ],
        parameters: [
          {
            name: 'email',
            in: 'formData',
            description: 'The email address to associate with the account.',
            required: true,
            type: 'string',
            default: 'test@email.com'
          }
        ],
        responses: {
          200: {
            description: 'An email has been dispatched to the indicated email address with a registration token.'
            // no Schema
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
    },
    '/login/register/claimValidate': {
      post: {
        summary: 'Validates that the email address is indeed owned by the requester. Creates a logged in session associated with the account.',
        operationId: 'registerClaimValidate',
        tags: [ 'login' ],
        parameters: [
          {
            name: 'token',
            in: 'query',
            description: 'The email address to associate with the account.',
            required: true,
            type: 'string',
            default: ''
          },
          {
            name: 'email',
            in: 'query',
            description: 'The email address to associate with the account.',
            required: true,
            type: 'string',
            default: 'test@email.com'
          }
        ],
        responses: {
          200: {
            description: 'The user has been validated, and a session has been started.'
            // no Schema
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
    },
    '/login/setPassword': {
      post: {
        summary: 'Changes the passowrd for the current logged in user',
        operationId: 'changePassword',
        tags: [ 'login' ],
        parameters: [
          {
            name: 'token',
            in: 'query',
            description: 'The email address to associate with the account.',
            required: true,
            type: 'string',
            default: ''
          },
          {
            name: 'email',
            in: 'query',
            description: 'The email address to associate with the account.',
            required: true,
            type: 'string',
            default: 'test@email.com'
          }
        ],
        responses: {
          200: {
            description: 'The user has been validated, and a session has been started.'
            // no Schema
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
