/* global module, process, require */

require('colors');

module.exports = {
  error: (module, method, message, error) => {
    process.stdout.write(`${module.red} ${method}: ${message}\n ${error}\n`);
  },
  info: (module, method, message) => {
    process.stdout.write(`${('Information: ' + module + ' >> ' + method).cyan}: ${message}\n`);
  }
};
