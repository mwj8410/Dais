/* global after, before, describe, module, it */

const expect = require('chai').expect;

const ModelHelpers = require('./model.helpers');

const testModel = [
  { valueName: 'restricted', dataType: 'string', required: false, private: true },
  { valueName: 'public', dataType: 'string', required: false }
];

describe('Utility: ModelHelpers', () => {
  it('exists', () => {
    expect(ModelHelpers).to.be.a('object');
  });

  describe('filterPrivate', () => {
    it('exists', () => {
      expect(ModelHelpers.filterPrivate).to.be.a('function');
    });

    it('removes private values from an instance', () => {
      const results = ModelHelpers.filterPrivate({ restricted: 'here', public: 'stays'}, testModel);
      expect(results.restricted).to.be.a('undefined');
      expect(results.public).to.be.a('string');
      expect(results.public).to.equal('stays');
    });
  });

  describe('filterPrivateSet', () => {
    it('exists', () => {
      expect(ModelHelpers.filterPrivateSet).to.be.a('function');
    });

    it('removes private values from all instances', () => {
      const results = ModelHelpers.filterPrivateSet([
        { restricted: 'here', public: 'stays'}, { restricted: 'here', public: 'stays' }
      ],
        testModel
      );

      // console.log(results);

      expect(results[0].restricted).to.be.a('undefined');
      expect(results[0].public).to.be.a('string');
      expect(results[0].public).to.equal('stays');
      expect(results[1].restricted).to.be.a('undefined');
      expect(results[1].public).to.be.a('string');
      expect(results[1].public).to.equal('stays');
    });
  });
});
