/* global after, before, describe, it */

const expect = require('chai').expect;
const typeCheck = require('./TypeCheck');

describe('Utility: typeCheck', () => {

  describe('data type: boolean', () => {
    it('recognizes a boolean value', () => {
      let result = typeCheck(true, { valueName: 'test', dataType: 'boolean' });
      expect(result).to.equal(true);
    });

    it('recognizes a non boolean value', () => {
      let result = typeCheck('nope', { valueName: 'test', dataType: 'boolean' });
      expect(result).to.equal(false);
    });
  });

  describe('data type: number', () => {
    it('recognizes a integer number value', () => {
      let result = typeCheck(1, { valueName: 'test', dataType: 'number' });
      expect(result).to.equal(true);
    });

    it('recognizes a float number value', () => {
      let result = typeCheck(1.1, { valueName: 'test', dataType: 'number' });
      expect(result).to.equal(true);
    });

    it('recognizes a non number value', () => {
      let result = typeCheck('nope', { valueName: 'test', dataType: 'number' });
      expect(result).to.equal(false);
    });
  });

  describe('data type: string', () => {
    it('recognizes a integer number value', () => {
      let result = typeCheck('123', { valueName: 'test', dataType: 'string' });
      expect(result).to.equal(true);
    });

    it('recognizes a non number value', () => {
      let result = typeCheck(1, { valueName: 'test', dataType: 'string' });
      expect(result).to.equal(false);
    });
  });

  describe('data type: date', () => {
    it('recognizes a integer number value', () => {
      let result = typeCheck(new Date(), { valueName: 'test', dataType: 'date' });
      expect(result).to.equal(true);
    });

    it('recognizes a non number value', () => {
      let result = typeCheck(1, { valueName: 'test', dataType: 'date' });
      expect(result).to.equal(false);
    });
  });

  describe('data type: email', () => {
    it('recognizes an email value', () => {
      let result = typeCheck('test@emai.com', { valueName: 'test', dataType: 'email' });
      expect(result).to.equal(true);
    });

    it('recognizes a non email value', () => {
      let result = typeCheck('test', { valueName: 'test', dataType: 'email' });
      expect(result).to.equal(false);
    });
  });

  describe('data type: enum', () => {
    it('recognizes an enum value', () => {
      let result = typeCheck('contact', { valueName: 'test', dataType: 'enum:userType' });
      expect(result).to.equal(true);
    });

    it('recognizes a non enum value', () => {
      let result = typeCheck('test', { valueName: 'test', dataType: 'enum:userType' });
      expect(result).to.equal(false);
    });

    it('fails on unrecognized enums', () => {
      let result = typeCheck('test', { valueName: 'test', dataType: 'enum:not-real' });
      expect(result).to.equal(false);
    });
  });

  describe('unknown data type', () => {
    it('passes a value', () => {
      let result = typeCheck('test@emai.com', { valueName: 'test', dataType: 'non-real' });
      expect(result).to.equal(true);
    });

    it('passes a different type of value', () => {
      let result = typeCheck(1, { valueName: 'test', dataType: 'non-real' });
      expect(result).to.equal(true);
    });
  });

});
