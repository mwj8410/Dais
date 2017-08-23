export const passwordPatterns = [
  { enforced: true, failMessage: 'Password must contain at least 1 lower case alphabetical character', pattern: /[a-z]/ },
  { enforced: true, failMessage: 'Password must contain at least 1 uppercase alphabetical character', pattern: /[A-Z]/ },
  { enforced: true, failMessage: 'Password must contain at least 1 numeric character', pattern: /[0-9]/},
  { enforced: false, failMessage: 'Password must contain at least one special character', pattern: /.*[!@#$%^&*]/ },
  { enforced: true, failMessage: 'Password must be at least 8 characters long', pattern: /.{8}/ }
];
