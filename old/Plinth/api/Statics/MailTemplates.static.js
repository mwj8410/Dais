/* global module */

const MailTemplates = {
  verifyEmail: {
    template: {
      templateName: 'verifyemail',
      fromEmail: 'no-reply@phaesynthe.com',
      fromName: 'Phaesynthe',
      subject: 'Verification: Profile Creation'
    },
    variables: {
      baseUrl: 'BASE_URL',
      registrationToken: 'REGISTRATION_TOKEN',
      email: 'EMAIL'
    }
  }
};

module.exports = MailTemplates;
