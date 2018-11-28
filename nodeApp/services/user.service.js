(() => {

  const User = require('../models').User;
  const $dbConnection = require('./index').database.connection;

  class UserService {

    constructor() {

    }

    /**
     * Gets an user given an UUID
     * @param uuid
     * @return {Promise.<*>}
     */
    async get(uuid) {
      const SQL = 'SELECT * FROM USERS WHERE UUID = ?';

      let _result = await $dbConnection.get(SQL, [uuid]);

      if(_result) { return _dtf.apply(this, [_result]); }
      else { return null; }
    }

    /**
     * Gets an user given an username
     * @param username
     * @return {Promise.<*>}
     */
    async getByUsername(username) {
      const SQL = 'SELECT * FROM USERS WHERE USERNAME = ?';

      let _result = await $dbConnection.get(SQL, [username]);

      if(_result) { return _dtf.apply(this, [_result]); }
      else { return null; }
    }
  }

  /**
   * Data transformation Function
   * @param result
   * @return {User}
   * @private
   */
  function _dtf(result) {
    let user = new User();

    user.username = result.username;
    user.password = result.password;
    user.uuid = result.uuid;
    user.email = result.email;

    return user;
  }


  module.exports = new UserService();
})();