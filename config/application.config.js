export const api = {
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
  port: process.env.NODE_ENV === 'production' ? 80 : process.env.DEV_PORT,

  // Session settings
  sessionSecret: 'keyboard kitty' // ToDo: place in env variable
};

export const externalName = 'Plinth MicroService';

export const internalName = 'Plinth MicroService';
