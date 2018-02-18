/* global module, require */

const enumStatics = require('../Statics/Enum.static');
const patterns = require('../../config/patterns.config');

// Expects
// { valueName: 'email', dataType: 'email', required: true },

const genericTypes = [
  'boolean',
  'number',
  'string'
];

/**
 * Validates if the value provided matches the type indicated
 * @param value the value being checked
 * @param typeDefinition An object describing the type. `{ valueName: 'email', dataType: 'email' }`
 * @return {boolean} if the value is of the correct type.
 */
const typeCheck = (value, typeDefinition) => {
  // If the typeDefinition indicates a generic dataType
  if (genericTypes.indexOf(typeDefinition.dataType) >= 0) {
    // Then simply check it
    return typeDefinition.dataType === typeof value;
  }

  if (typeDefinition.dataType === 'date') {
    return typeof value.getMonth === 'function';
  }

  if (typeDefinition.dataType.indexOf('enum') >= 0) {
    let enumType = typeDefinition.dataType.split(':')[1];
    // Doe the enum set exist?
    if (!enumStatics[enumType]) {
      return false;
    }
    // We could test if the value is a string, and this would serve for 99% of cases.
    // However, we would rather not make assumptions that we are not required to make.

    // Test if the string value is in the enum set
    return enumStatics[enumType].map((item) => item.value).indexOf(value) >= 0;
  }

  // Otherwise, we need to inspect it more manually
  // For now, we are not going to care about compound object types, so anything passed in here is a string
  // so we just need to check to see if we have a validation pattern recorded
  if (typeof patterns[typeDefinition.dataType] !== 'undefined') {
    let allPassed = true;

    patterns[typeDefinition.dataType].forEach((validation) => {
      if (validation.pattern.test(value) === false) {
        allPassed = false;
      }
    });

    // We don't really care why it failed
    return allPassed;
  }
  // We cannot test, if we have no test
  return true;

};

module.exports = typeCheck;
