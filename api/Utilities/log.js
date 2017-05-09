/* global module, process, require */

require('colors');

let logLevel = 'all';

module.exports = {
  error: (module, method, message, error) => {
    if (logLevel === 'all') {
      process.stdout.write(`${module.red} ${method}: ${message}\n ${error}\n`);
    }
  },
  info: (module, method, message) => {
    if (logLevel === 'all') {
      process.stdout.write(`${('Information: ' + module + ' >> ' + method).cyan}: ${message}\n`);
    }
  },
  security: (module, method, message) => {
    if (logLevel === 'all') {
      process.stdout.write(`${('Security: ' + module + ' >> ' + method).magenta}: ${message}\n`);
    }
  },
  setLevel: levelName => {
    if (levelName === 'silent') {
      logLevel = 'silent';
    }
  }
};
