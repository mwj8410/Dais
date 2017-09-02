/* global module */

const UserModel = [
  // Automatically created:
  { valueName: 'id', dataType: 'uuid4', required: true, autoCreated: true },
  { valueName: 'userType', dataType: 'enum:UserType', required: true, autoCreated: true},
  { valueName: 'createDate', dataType: 'date', required: true, autoCreated: true },
  { valueName: 'updatedDate', dataType: 'date', required: true, autoCreated: true },

  { valueName: 'email', dataType: 'email', required: true },

  { valueName: 'nameDisplay', dataType: 'string', required: false },
  { valueName: 'nameFirst', dataType: 'string', required: false },
  { valueName: 'nameLast', dataType: 'string', required: false },
  { valueName: 'nameLogin', dataType: 'string', required: true },

  { valueName: 'active', dataType: 'boolean', required: false },
  { valueName: 'dateOfBirth', dataType: 'date', required: false },

  { valueName: 'authPassword', dataType: 'string', required: false, private: true },
  { valueName: 'authSalt', dataType: 'string', required: false, private: true },
  { valueName: 'authRegistrationToken', dataType: 'string', required: false, private: true },
  { valueName: 'authRegistrationTokenDate', dataType: 'date', required: false, private: true },

  { valueName: 'createdSource', dataType: 'string', required: false }
];

module.exports = UserModel;
