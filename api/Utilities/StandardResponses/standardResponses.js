/**
 * Standard HTTP response payloads.
 *
 * The intention is for the consuming request handlers to transform the message portion as needed.
 *
 * @type {{code: number, message: string}}
 */

module.exports = {

  conflict: {
    code: 409,
    message: 'The content of the request is in conflict with underlying systems.'
  },

  malformed: {
    code: 422,
    message: 'The content of the request is malformed or invalid in some way. Please correct before trying again.'
  },

  notFound: {
    code:404,
    message: 'The provided criteria did not match any records.'
  },

  server: {
    code: 500,
    message: 'The server has experienced an irrecoverable error.'
  },

  unAuthorized: {
    code: 401,
    message: 'Request not authorized.'
  }
};
