/* global module, require */

// This service uses machinepack-mandrill in lieu of writing a more specific integration
// Thi is because the current needs are very minimal.

const mandrill = require('machinepack-mandrill');

const log = require('../Utilities/log');
const MandrillConfig = require('../../config/connectionSources.config').mandrill;
const MailTemplates = require('../Statics/MailTemplates.static');

module.exports = {

  /**
   * Instructs Mandrill to dispatch the indicated email template with variables to the provided emaill address.
   * @param {string} templateName remote name for the template
   * @param {string} email address to send the message to
   * @param {object} options variables sent to mandrill
   * @param {function} callback Error first method to call with results.
   */
  send: (templateName, email, options, callback) => {
    const templateProfile = MailTemplates[templateName];
    let passValues = [];

    Object.keys(options).forEach((key) => {
      if (templateProfile.variables[key]) {
        passValues.push({
          name: templateProfile.variables[key],
          content: options[key]
        });
      } else {
        log.warning('Mandrill Service', 'send', 'Attempt to set variable that is not registered in the template.');
      }
    });

    log.activity('Mandrill Service', 'send', `Sending ${templateName} email template to ${email}.`);

    mandrill.sendTemplateEmail(Object.assign({
      apiKey: MandrillConfig.apiToken,
      toEmail: email,
      mergeVars: passValues
    }, templateProfile.template)).exec({
      error: (error) => {
        // let error = new Error('Encountered an unresolvable error while interacting with the remote email service.');
        log.error('Mandrill Service', 'send', 'Encountered error while sending', error);
        return callback(error);
      },
      success: () => {
        return callback(undefined);
      }
    });
  }
};
