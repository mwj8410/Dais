/* global after, before, describe, require, it */

const expect = require('chai').expect;

const passwordService = require('./password');

describe('Utility: PasswordService', () => {
  it('exists', () => {
    expect(passwordService).to.be.a('object');
  });

  describe('createSalt', () => {
    it('exists', () => {
      expect(passwordService.createSalt).to.be.a('function');
    });

    it('creates a salt', () => {
      const result = passwordService.createSalt();
      expect(result.length).to.equal(29);
    });
  });

  describe('createToken', () => {
    it('exists', () => {
      expect(passwordService.createToken).to.be.a('function');
    });

    it('creates a token', () => {
      const result = passwordService.createToken(8);
      expect(result.length).to.equal(8);
    });
  });

  describe('hashPassword', () => {

    it('exists', () => {
      expect(passwordService.hashPassword).to.be.a('function');
    });

    it('hashes a password with a provided salt', () => {
      const salt = passwordService.createSalt();
      const result = passwordService.hashPassword('rawPassword', salt);
      expect(result.length).to.equal(60);
    });

  });

  describe('validate', () => {
    it('exists', () => {
      expect(passwordService.validate).to.be.a('function');
    });

    it('validates a password', () => {
      const password = 'Abcd1234';
      const result = passwordService.validate(password);

      expect(result).to.be.a('object');
      expect(result.errors.length).to.equal(0);
      expect(result.valid).to.equal(true);
    });

    it('reports invalid password matches', () => {
      const password = 'abcd1234';
      const result = passwordService.validate(password);

      expect(result).to.be.a('object');
      expect(result.errors.length).to.equal(1);
      expect(result.valid).to.equal(false);
    });

  });

});
