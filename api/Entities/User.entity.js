const bc = require('bcrypt');

const log = require('../Utilities/log');
const db = require('../DataStore/User.datastore');
// const saltRounds = 10; // would be used if we set a password

// TODO: should always trip internal and sensitive fields before transmitting externally

module.exports = {
  getById: id => {
    const results = db.filter(user => user.id === id);
    if (!results.length) {
      log.error('User', `Unable to locate the indicated user record: ${id}`);
    }
    return results[0];
  },
  validateByPassword: (userName, credential) => {
    let user = db.filter(user => {
      // Add additional criteria for valid users here.
      return user.userName === userName
        && user.credential === bc.hashSync(credential, user.salt);
    });

    if (!user.length) {
      log.security('User', `validateByPassword', 'failed attempt to log in with the following credentials:\nUser Name:${userName} Password: ${credential}`);
    }
    return user[0];
  }
};
