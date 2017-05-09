/* global module, process, require */

const bodyParser = require('body-parser');
const express = require('express');
const log = require('./Utilities/log');

let host = express();
let hostConfig;
let server;

module.exports = {
  close: () => {
    server.close();
  },

  initialize: config => {
    if (!config) {
      log.error('Host', 'initialize', 'The host module requires that a configuration object be provided.');
      return;
    }
    hostConfig = config;

    host.use(bodyParser.json());
    host.use(bodyParser.text());
    host.use((req, res, next) => {
      // These need to be made available in configuration
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

  },

  listen: () => {
    // Retain a reference to the started application, so it can be closed later.
    server = host.listen(hostConfig.port, () => {
      log.info('Host', 'listen', `listening on port: ${hostConfig.port}.`);
    });
  },

  mountRoutes: routeList => {
    routeList.forEach(route => {
      switch (route[1]) {
        case 'GET':
          host.get(`${hostConfig.baseUrl}${route[0]}`, route[2]);
          break;
        case 'POST':
          host.post(`${hostConfig.baseUrl}${route[1]}`, route[2]);
          break;
        case 'PUT':
          host.put(`${hostConfig.baseUrl}${route[1]}`, route[2]);
          break;
        case 'PATCH':
          host.patch(`${hostConfig.baseUrl}${route[1]}`, route[2]);
          break;
        case 'DELETE':
          host.delete(`${hostConfig.baseUrl}${route[1]}`, route[2]);
          break;
        default:
          break;
      }
      log.info('Host', 'mountRoutes', `mounted handler for: ${route[1]} ${route[0]}.`);
    });
  }
};
