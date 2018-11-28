(() => {

  const $config = require('../../config');
  const User = require('../models').User;
  const $dbConnection = require('./index').database.connection;
  const $uuid = require('uuid/v1');
  const bcrypt = require('bcrypt');

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

    /**
     * Adds a new user
     * @param username
     * @param password
     * @param email
     * @param role
     * @param uuid
     * @return {Promise.<void>}
     */
    async add(username, password, email, role, uuid) {
      const SQL = 'INSERT INTO USERS(UUID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES(?, ?, ?, ?, ?)';

      if(!uuid) { uuid = $uuid(); }
      if(!role) { role = 'USER'; }

      let _bCryptPassword = await bcrypt.hash(password, $config.server.security.bcryptSaltRounds);

      //Execute query
      await $dbConnection.run(SQL, [
        uuid,
        username,
        _bCryptPassword,
        email,
        role
      ]);

      let user = new User();

      user.username = username;
      user.password = _bCryptPassword;
      user.uuid = uuid;
      user.email = email;
      user.role = role;

      return user;
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
    user.role = result.role;

    return user;
  }


  module.exports = new UserService();
})();