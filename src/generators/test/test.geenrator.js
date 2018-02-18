'use strict'

// External packages
const toSource = require('tosource')

// Internal Modules
const packageUtil = require('../../../lib/Package/package.utility')

// Helpers

const getFileHeading = (context) => {
  return `/* global after, before, describe, it */
'use strict'
/**
 * This file was generated ${(new Date()).toISOString()} by Plinth ${packageUtil.getVersion()}.
 **/

const chai = require('chai')
const supertest = require('supertest')
const sinon = require('sinon')

const Plinth = require('@phaesynthe/plinth')

const config = Plinth.config.get('host')
const expect = chai.expect

const URI_BASE = \`http://localhost:\${config.port}\`
const st_request = supertest(URI_BASE)

const controllerModule = require('../../../app/controllers/${context.controller}')

require('../common')
`
}

const getPassTest = function getPassTest (context) {
  let out = `
  it('accepts valid requests and routes to the controller', (done) => {
    sinon.stub(controllerModule, '${context.functionName}')
      .callsFake((session, routeParams, queryParams, body) => {
        return new Promise((resolve, reject) => {
        
        })
      })
      
    after(() => {
      controllerModule.${context.functionName}.restore()
    })
    
    st_request.${context.method.toLowerCase()}('${context.route}')
      
      .expect(200)
      .end((err, resp) => {
        expect(true).to.equal(true)
        sinon.assert.calledOnce(controllerModule.${context.functionName})
        done()
      })
  })
  `

  return out
}

const generateTest = function generateTest (context) {
  let generatedTest = getFileHeading(context)

  generatedTest += `
describe('${context.method} ${context.route}', () => {
  ${getPassTest(context)}
  
})
`

  return generatedTest
}

module.exports = generateTest
