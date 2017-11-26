/* global after, before, describe, it */

const expect = require('chai').expect;
const sinon = require('sinon');

const Log = require('./Log');

const delay = 10;

describe('lib >> Utility: Log', () => {

  // These pollute the log
  before((done) => {
    setTimeout(() => {
      Log.setLevel('all');
      done();
    }, delay);
  });

  after(() => {
    Log.setLevel('silent');
  });

  [
    'activity',
    'error',
    'info',
    'notice',
    'security',
    'warning'
  ].forEach((logLevelName) => {

    describe(logLevelName, () => {

      it('exists', () => {
        expect(Log[logLevelName]).to.be.a('function');
      });

      it('logs the appropriate level', () => {
       sinon.stub(process.stdout, 'write');

       Log[logLevelName]('Module', 'method', 'message');
       expect(process.stdout.write.calledOnce).to.be.true;
       process.stdout.write.restore();

      });

      it('does not log when the level is set below the indicated level', () => {
        Log.setLevel('silent');

        sinon.stub(process.stdout, 'write');

        Log[logLevelName]('Module', 'method', 'message');
        expect(process.stdout.write.calledOnce).to.be.false;
        process.stdout.write.restore();
        Log.setLevel('all');
      });

    });
  });

  describe('setLevel', () => {

    it('exists', () => {
      expect(Log.setLevel).to.be.a('function');
    });

    it('processes an unknown level as `all`', () => {
      Log.setLevel('notReal');
    });

  });

});
