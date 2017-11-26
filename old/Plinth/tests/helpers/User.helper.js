/* global module, require */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const sinon = require('sinon');

const LoginController = require('../../api/Controllers/Login.controller');

chai.use(chaiHttp);

const userFixtures = {
  standardUser: {
    id: '4cd0d6b2-fa32-466e-98f7-1859383550bd'
  }
};

module.exports = {

  getFixture: (userType) => {
    return userFixtures[userType];
  },

  /**
   * Establishes a sessions as a standard user account.
   * @param {function} callback Error first method called when the operation is complete.
   */
  getStandardUser: (callback) => {
    let loggedInUser = chai.request.agent(global.application);

    sinon.stub(LoginController, 'login').callsFake((values, cb) => {
      return cb(undefined, { id: userFixtures.standardUser.id });
    });

    loggedInUser
      .post('/login')
      .send({
        nameLogin: 'testName',
        authPassword: 'Abc123'
      })
      .end((err, res) => {
        LoginController.login.restore();

        expect(res.status).to.equal(200);
        callback(err, loggedInUser);
      });
  }
};
