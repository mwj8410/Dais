module.exports = {

  // Used for final user facing display.
  externalName: 'Plinth',

  // used for internal and development facing operations that will never be reported to the end user
  internalName: 'Plinth',

  api: {
    baseUrl: 'v1',

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
    port: process.env.NODE_ENV === 'production' ? 80 : 24601
  }

};
