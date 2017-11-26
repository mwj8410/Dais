/* global module */

/**
 * Defines all of the enum value sets used in the application by name.
 *
 * Internal processes assume that the root level will be the public name for the enum set, and it will contain
 * an array of Objects that have a value attribute and conditionally a default attribute. All other parameters
 * are open for custom use.
 */
const enumerableValues = {
  userType: [
    { label: 'Administrator', value: 'admin' },
    { label: 'Contact', value: 'contact', default: true },
    { label: 'Member', value: 'member' }
  ]
};

module.exports = enumerableValues;
