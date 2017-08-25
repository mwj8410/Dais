/* global module, process, require */

require('colors');

const levels = {
  silent: 0,
  errors: 1,
  security: 2,
  warnings: 3,
  notice: 4,
  info: 5,
  all: 10
};

let logLevel = 10;

const Log = {
  /**
   * Sets the log level to Errors only.
   * This is the lowest level of Logs.
   * @param {string} module Recognizable name for the reporting module.
   * @param {string} method Name of the method that experienced the error.
   * @param {string} message Short description of the error situation.
   * @param {Error} error Error object
   */
  error: (module, method, message, error) => {
    if (logLevel >= levels.error) {
      process.stdout.write(`${module.red} ${method}: ${message}\n ${error}\n`);
    }
  },

  /**
   * Sets the log level to Info messages and every Log level below.
   * @param {string} module Recognizable name for the reporting module.
   * @param {string} method Name of the method that experienced the log event.
   * @param {string} message Short description of the situation.
   */
  info: (module, method, message) => {
    if (logLevel >= levels.info) {
      process.stdout.write(`${('Information: ' + module + ' >> ' + method).cyan}: ${message}\n`);
    }
  },

  /**
   * Sets the log level to Notice messages and every Log level below.
   * @param {string} module Recognizable name for the reporting module.
   * @param {string} method Name of the method that experienced the log event.
   * @param {string} message Short description of the situation.
   */
  notice: (module, method, message) => {
    if (logLevel >= levels.notice) {
      process.stdout.write(`${('Notice: ' + module + ' >> ' + method).green}: ${message}\n`);
    }
  },

  /**
   * Sets the log level to Security messages and every Log level below.
   * @param {string} module Recognizable name for the reporting module.
   * @param {string} method Name of the method that experienced the log event.
   * @param {string} message Short description of the situation.
   */
  security: (module, method, message) => {
    if (logLevel >= levels.security) {
      process.stdout.write(`${('Security: ' + module + ' >> ' + method).magenta}: ${message}\n`);
    }
  },

  /**
   * Configures what level of messages to show.
   * @param {string} levelName
   */
  setLevel: levelName => {
    let levelCode = levels[levelName];
    if (typeof levelCode === 'undefined') {
      levelCode = levels['all'];
    }
    logLevel = levelCode;
  },

  /**
   * Sets the log level to Warning messages and every Log level below.
   * @param {string} module Recognizable name for the reporting module.
   * @param {string} method Name of the method that experienced the log event.
   * @param {string} message Short description of the situation.
   */
  warning: (module, method, message) => {
    if (logLevel >= levels.warning) {
      process.stdout.write(`${('WARNING: ' + module + ' >> ' + method).yellow}: ${message}\n`);
    }
  }
};

export default Log;
