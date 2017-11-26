/* global module */

module.exports = {
  url: process.env.HOST_URL,

  // Used in Cors configuration
  origins: process.env.NODE_ENV === 'production' ?
    process.env.CORS_ORIGINS :
    `${
      [
        'http://localhost',
        'https://localhost',
        'http://localhost:8080',
        'https://localhost:8080'
      ].join(',')
      }`
  ,

  // When in production mode, we want to expose the standard port, otherwise, expose the development port
  port: 8080// process.env.NODE_ENV === 'development' ? 8080 : process.env.PORT
}
