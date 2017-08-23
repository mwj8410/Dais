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
  error: (module, method, message, error) => {
    if (logLevel >= levels.error) {
      process.stdout.write(`${module.red} ${method}: ${message}\n ${error}\n`);
    }
  },
  info: (module, method, message) => {
    if (logLevel >= levels.info) {
      process.stdout.write(`${('Information: ' + module + ' >> ' + method).cyan}: ${message}\n`);
    }
  },
  notice: (module, method, message) => {
    if (logLevel >= levels.notice) {
      process.stdout.write(`${('Notice: ' + module + ' >> ' + method).green}: ${message}\n`);
    }
  },
  security: (module, method, message) => {
    if (logLevel >= levels.security) {
      process.stdout.write(`${('Security: ' + module + ' >> ' + method).magenta}: ${message}\n`);
    }
  },
  setLevel: levelName => {
    let levelCode = levels[levelName];
    if (!levelCode) {
      levelCode = levels['all'];
    }
    logLevel = levelCode;
  },
  warning: (module, method, message) => {
    if (logLevel >= levels.warning) {
      process.stdout.write(`${('WARNING: ' + module + ' >> ' + method).yellow}: ${message}\n`);
    }
  }
};

export default Log;
