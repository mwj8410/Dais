/* global after, before, describe, it */

const expect = require('chai').expect;

const log = require('./log');

describe('Utility: Log', () => {
  // These pollute the log
  before((done) => {
    setTimeout(() => {
      log.setLevel('all');
      done();
    }, 100);
  });

  after(() => {
    log.setLevel('silent');
  });

  describe('activity', () => {
    it('exists', () => {
      expect(log.activity).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.activity('Module', 'method', 'message');
    });
  });

  describe('error', () => {
    it('exists', () => {
      expect(log.error).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.error('Module', 'method', 'message', new Error());
    });
  });

  describe('info', () => {
    it('exists', () => {
      expect(log.info).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.info('Module', 'method', 'message');
    });
  });

  describe('notice', () => {
    it('exists', () => {
      expect(log.notice).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.notice('Module', 'method', 'message');
    });
  });

  describe('security', () => {
    it('exists', () => {
      expect(log.security).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.security('Module', 'method', 'message');
    });
  });

  describe('setLevel', () => {
    it('exists', () => {
      expect(log.setLevel).to.be.a('function');
    });

    it('processes an unknown level as `all`', () =>{
      log.setLevel('notReal');
    });
  });

  describe('warning', () => {
    it('exists', () => {
      expect(log.warning).to.be.a('function');
    });

    it('logs the appropriate level', () => {
      log.warning('Module', 'method', 'message');
    });
  });

});
