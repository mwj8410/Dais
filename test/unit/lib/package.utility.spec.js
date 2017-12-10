/* global after, before, describe, it */

const chai = require('chai')
// const sinon = require('sinon')

const packageUtil = require('../../../lib/Package/package.utility')

const expect = chai.expect

describe('lib >> Package utility', () => {

  describe('getName()', () => {

    it('exists', () => {
      expect(packageUtil.getName).to.be.a('function')
    })

    it('provides the current package name', () => {
      const name = packageUtil.getName()
      expect(name).to.be.a('string')
      expect(name).to.equal('@phaesynthe/plinth')
    })

  })

  describe('getVersion()', () => {

    it('exists', () => {
      expect(packageUtil.getVersion).to.be.a('function')
    })


  })

})
