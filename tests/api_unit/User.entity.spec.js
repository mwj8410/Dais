/* global describe, it, require */
const expect = require('expect');

const userEntity = require('../../api/Entities/User.entity');

describe('Entity >> User:', () => {

  describe('getById', () => {

    it('exists', () => {
      expect(typeof userEntity.getById).toBe('function');
    });

    it('returns a user record when provided a valid user id', () => {
      // TODO: mock out the data access
      const userRecord = userEntity.getById(1);
      expect(userRecord.id).toBe(1);
      expect(userRecord.firstName).toBe('Matthew'); // I would have provided this return value in the mock
    });

    it('returns no records when the user id does not match any record', () => {
      // TODO: mock out the data access
      const userRecord = userEntity.getById(1212);
      expect(typeof userRecord).toBe('undefined');
    });

  });

  describe('validateByPassword', () => {

    it('is exists', () => {
      expect(typeof userEntity.validateByPassword).toBe('function');
    });

    it('returns a user when provided with a valid credential and password', () => {
      const user = userEntity.validateByPassword('matthew', 'qwerty');
      expect(user.id).toBe(1);
    });

    it('returns no records when the credential does not match the credential on record', () => {
      const user = userEntity.validateByPassword('matthew', 'nope');
      expect(typeof user).toBe('undefined');
    });

    it('returns no records when the user name does a user on', () => {
      const user = userEntity.validateByPassword('nope', 'qwerty');
      expect(typeof user).toBe('undefined');
    });

  });
});
