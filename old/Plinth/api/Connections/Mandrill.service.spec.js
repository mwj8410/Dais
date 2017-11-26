/* global after, before, describe, it */

const expect = require('chai').expect;
const mandrill = require('machinepack-mandrill');
const sinon = require('sinon');

const MandrillService = require('./Mandrill.service');

describe('Service: Mandrill', () => {

  it('exists', () => {
    expect(MandrillService).to.be.a('object');
  });

  describe('send', () => {

    it('exists', () => {
      expect(MandrillService.send).to.be.a('function');
    });

    it('passes the correct template', (done) => {
      let passedTemplateObject;
      sinon.stub(mandrill, 'sendTemplateEmail').callsFake((templateObject) => {
        passedTemplateObject = templateObject;
        return {
          exec: (responder) => {
            responder.success();
          }
        };
      });

      MandrillService.send(
        'verifyEmail',
        'test@email.com',
        {
          baseUrl: 'BASE_URL',
          registrationToken: 'REGISTRATION_TOKEN',
          email: 'EMAIL'
        },
        (error) => {
          mandrill.sendTemplateEmail.restore();

          expect(error).to.be.a('undefined');
          expect(passedTemplateObject.apiKey).to.be.a('string');
          expect(passedTemplateObject.toEmail).to.be.a('string');
          expect(passedTemplateObject.templateName).to.be.a('string');
          expect(passedTemplateObject.fromEmail).to.be.a('string');
          expect(passedTemplateObject.fromName).to.be.a('string');
          expect(passedTemplateObject.subject).to.be.a('string');
          expect(passedTemplateObject.mergeVars).to.be.a('array');

          done();
        });
    });

    it('reports errors', (done) => {
      sinon.stub(mandrill, 'sendTemplateEmail').callsFake(() => {
        return {
          exec: (responder) => {
            responder.error(new Error());
          }
        };
      });

      MandrillService.send(
        'verifyEmail',
        'test@email.com',
        {
          baseUrl: 'BASE_URL',
          registrationToken: 'REGISTRATION_TOKEN',
          email: 'EMAIL'
        },
        (error) => {
          mandrill.sendTemplateEmail.restore();

          expect(error).to.be.a('Error');
          done();
        });
    });

    it('ignores unknown variables', (done) => {
      sinon.stub(mandrill, 'sendTemplateEmail').callsFake(() => {
        return {
          exec: (responder) => {
            responder.error();
          }
        };
      });

      MandrillService.send(
        'verifyEmail',
        'test@email.com',
        {
          baseUrl: 'BASE_URL',
          registrationToken: 'REGISTRATION_TOKEN',
          email: 'EMAIL',
          unknown: 'test'
        },
        (error) => {
          mandrill.sendTemplateEmail.restore();

          expect(error).to.be.a('undefined');
          done();
        });
    });

  });

});
