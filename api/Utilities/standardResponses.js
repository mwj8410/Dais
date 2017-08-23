/**
 * Standard HTTP response payloads.
 *
 * The intention is for the consuming request handlers to transform the message portion as needed.
 *
 * @type {{code: number, message: string}}
 */

export const conflict = {
  code: 409,
  message: 'The content of the request is in conflict with underlying systems.'
};

export const malformed = {
  code: 422,
  message: 'The content of the request is malformed or invalid in some way. Please correct before trying again.'
};

export const server = {
  code: 500,
  message: 'The server has experienced an irrecoverable error.'
};

export const unAuthorized = {
  code: 401,
  message: 'Request not authorized.'
};
