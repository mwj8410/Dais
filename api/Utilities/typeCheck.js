const patterns = require('../../config/patterns.config');

// Expects
// { valueName: 'email', dataType: 'email', required: true },

const genericTypes = [
  'boolean',
  'date',
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
  if (genericTypes.indexOf(typeDefinition.dataType)) {
    // Then simply check it
    return typeDefinition.dataType === typeof value;
  }

  // Otherwise, we need to inspect it more manually
  // For now, we are not going to care about compound object types, so anything passed in here is a string
  // so we just need to check to see if we have a validation pattern recorded
  if (typeof patterns[typeDefinition.dataType] !== 'undefined') {
    let allPassed = true;

    patterns[typeDefinition.dataType].forEach(validation => {
      if (validation.pattern.test(value) === false) {
        allPassed = false;
      }
    });

    // We don't really care why it failed
    return allPassed;
  }
  // We cannot test, if we have no tests
  return true;

};

module.exports = typeCheck;
