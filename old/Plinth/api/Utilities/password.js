/* global module, require */
const bcrypt = require('bcrypt');
const passwordPatterns = require('../../config/patterns.config').password;

const saltRounds = 10;
const safeCharacters = 'abcdefghijklonopqrstuvwxyz1234567890';

const PasswordService = {
  /**
   * Generates a random string for use as a password salt
   * @return {string} random string of characters.
   */
  createSalt: () => {
    return bcrypt.genSaltSync(saltRounds);
  },

  /**
   * Creates a pseudo-random token that is url safe and can be used for a multitude of features.
   * @param {number} length The number of characters to include.
   */
  createToken: (length) => {
    let text = '';
    for (let i = 0; i < length; i++) {
      text += safeCharacters.charAt(Math.floor(Math.random() * safeCharacters.length));
    }
    return text;
  },

  /**
   * Generate a hashed encoded password from a provided password and salt
   * @param {string} planePassword password s it is provided to the service.
   * @param {string} salt Password complexity decorator
   * @return {string} encoded password
   */
  hashPassword: (planePassword, salt) => {
    return bcrypt.hashSync(planePassword, salt);
  },

  /**
   * Validates that a provided string matches the password requirements.
   * @param {string} planePassword the raw string text to validate as being a password.
   * @returns {{errors: Array, valid: boolean}}
   */
  validate: (planePassword) => {
    let errors = [];

    passwordPatterns.filter((pattern) => pattern.enforced)
      .forEach((pattern) => {
        if (pattern.pattern.test(planePassword) === false) {
          errors.push(pattern.failMessage);
        }
      });

    return {
      errors: errors,
      valid: errors.length === 0
    };
  }
};

module.exports = PasswordService;
