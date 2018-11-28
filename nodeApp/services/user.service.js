(() => {

  const User = require('../models').User;
  const $dbConnection = require('./index').database.connection;

  class UserService {
    constructor() {

    }

    /**
     * Gets an user given an UUID
     * @param uuid
     * @return {Promise.<void>}
     */
    async get(uuid) {
      const SQL = 'SELECT * FROM USERS WHERE UUID = ?';

      let _result = await $dbConnection.get(SQL, [uuid]);

      return _dtf.apply(this, [_result]);
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