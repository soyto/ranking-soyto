(() => {

  const $path = require('path');
  const $config = require('../../../config');
  const $fs = require('../../helpers').fs;
  const $log = require('../../helpers').log;
  const sqlite3 = require('sqlite3').verbose();
  const bcrypt = require('bcrypt');

  /**
   * SQL Error class
   */
  class SQLError extends Error {
    constructor (message) {
      super(message);
    }
  }


  class Connection {


    constructor () {
      this.connection = null;
    }

    /**
     * Init database and stablish connection
     * @return {Promise.<void>}
     */
    async init () {

      //Exists db file?
      if(!(await $fs.exists($config.files.database))) {
        $log.warn('Generating database file');

        await _createDatabase.apply(this);
      }

      //Create and store connection
      this.connection = await _connect($config.files.database);

      //Check database version
      await _checkDatabaseVersion.apply(this);
    }

    /**
     * Query database and get first record
     * @param query
     * @param params
     * @return {Promise}
     */
    async get(query, params) {
      return new Promise((done, reject) => {

        if(!this.connection || !this.connection.open) {
          return reject(new SQLError('Database not connected'));
        }

        this.connection.get(query, params, (err, result) => {
          if(err) { return reject(err); }
          else { return done(result); }
        });
      });
    }

    /**
     * Query database and get all results
     * @param query
     * @param params
     * @return {Promise}
     */
    async all(query, params) {
      return new Promise((done, reject) => {

        if(!this.connection || !this.connection.open) {
          return reject(new SQLError('Database not connected'));
        }

        this.connection.all(query, params, (err, result) => {
          if(err) { return reject(err); }
          else { return done(result); }
        });
      });
    }

    /**
     * Update database records
     * @param query
     * @param params
     * @return {Promise}
     */
    async run(query, params) {
      return new Promise((done, reject) => {

        if(!this.connection || !this.connection.open) {
          return reject(new SQLError('Database not connected'));
        }

        this.connection.run(query, params, (err, result) => {
          if(err) { return reject(err); }
          else { return done(result); }
        });
      });
    }
  }

  /**
   * Creates database
   * @return {Promise.<void>}
   * @private
   */
  async function _createDatabase() {

    //Exists folder? if not, create it
    if(!(await $fs.exists($config.folders.database))) {
      await $fs.mkdir($config.folders.database);
    }

    //Generate file
    await $fs.write($config.files.database, '');
  }

  /**
   * Checks database version
   * @return {Promise.<void>}
   * @private
   */
  async function _checkDatabaseVersion() {

    try {

      //Wich is current version?
      let _currentVersion = await this.get('SELECT * FROM VERSION');

      //TODO: Here we will update automatically database

    } catch (error) {

      //That error is given when there is no data in database file
      if(error.errno === 1) {
        return _setupDatabase.apply(this);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * Update database from the version specified
   * @return {Promise.<void>}
   * @private
   */
  async function _setupDatabase() {
    $log.warn('Setting up database');

    let _script = await $fs.read($path.join($config.folders.dbScripts, '0.0.1.sql'));

    //Spit script with special comments
    let _fragments = _script.split('---- #\n');

    //Execute each fragment
    for(let $$fragment of _fragments) {
      await this.run($$fragment.trim());
    }

    $log.warn('Generating admin user');

    let _adminUser = {
      'uuid': $config.server.admin.uuid,
      'username': $config.server.admin.username,
      'password': $config.server.admin.password,
      'email': $config.server.admin.email,
    };

    _adminUser.password = await bcrypt.hash(_adminUser.password, $config.server.security.bcryptSaltRounds);

    await this.run(`INSERT INTO USERS(UUID, EMAIL, USERNAME, PASSWORD) VALUES(?, ?, ?, ?)`, [
      _adminUser.uuid,
      _adminUser.email,
      _adminUser.username,
      _adminUser.password
    ]);
  }

  /**
   * Connect to database
   * @param file
   * @return {Promise}
   * @private
   */
  async function _connect(file) {
    return new Promise((resolve, reject) => {
      let _connection = new sqlite3.Database(file, (err) => {
        if(err) { return reject(err); }
        else { return resolve(_connection); }
      });
    });
  }


  module.exports = new Connection();
})();