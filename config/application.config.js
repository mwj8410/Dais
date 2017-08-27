module.exports = {
  api: {
    url: process.env.HOST_URL,
    origins: process.env.NODE_ENV === 'production' ?
      process.env.CORS_ORIGINS :
      `${process.env.CORS_ORIGINS},${
        [
          'http://localhost',
          'https://localhost'
        ].join(',')
        }`
    ,

    // When in production mode, we want to expose the standard port, otherwise, expose the development port
    port: process.env.NODE_ENV === 'production' ? 80 : process.env.DEV_PORT
  },

  internalName: 'Plinth MicroService',

  Session: {
    // Currently configures for the `connect-mongo` session store
    database: process.env.SESSION_DB,
    sessionSecret: process.env.SESSION_SECRET,
    url: process.env.SESSION_URL,
    user: process.env.SESSION_USER,
    password: process.env.SESSION_PASSWORD
  }

};
