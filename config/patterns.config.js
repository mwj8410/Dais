/**
 * Patterns Configuration
 *
 * A collected place to store all Regular Expression patterns on a per field
 * and per rule basis. This approach allows the consuming service to expose
 * the exact failure reason and reduce that to a fail message.
 */

module.exports = {
  email: [
    // Pattern from W3C. Should match HTML form type="email" validation
    // as per https://www.w3.org/TR/2012/WD-html-markup-20120320/input.email.html
    { enforced: true, failMessage: 'Not a valid email address', pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }
  ],
  password: [
    { enforced: true, failMessage: 'Password must contain at least 1 lower case alphabetical character', pattern: /[a-z]/ },
    { enforced: true, failMessage: 'Password must contain at least 1 uppercase alphabetical character', pattern: /[A-Z]/ },
    { enforced: true, failMessage: 'Password must contain at least 1 numeric character', pattern: /[0-9]/},
    { enforced: false, failMessage: 'Password must contain at least one special character', pattern: /.*[!@#$%^&*]/ },
    { enforced: true, failMessage: 'Password must be at least 8 characters long', pattern: /.{8}/ }
  ],
  phoneNumber: [ // We will expect sending systems to normalize to 123.512.555.0000x123456
    { enforced: true, failMessage: 'Not a valid phone number', pattern: /^[0-9]{0,3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{4}(x[0-9]{1,6})?$/ }
  ],

  uuid1: [
    { enforced: true, failMessage: 'Not a valid UUID v1', pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i }
  ],
  uuid2: [
    { enforced: true, failMessage: 'Not a valid UUID v2', pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i }
  ],
  uuid3: [
    { enforced: true, failMessage: 'Not a valid UUID v3', pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i }
  ],
  uuid4: [ // This is the standard that will be used in this service
    { enforced: true, failMessage: 'Not a valid UUID v4', pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i }
  ],
  uuid5: [
    { enforced: true, failMessage: 'Not a valid UUID v5', pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i }
  ]
};
