(() => {

  const $config = require('../../config');
  const Character = require('../models').Character;
  const $dbConnection = require('./index').database.connection;

  class CharacterService {
    constructor() {

    }

    /**
     * Retrieves a character given his serverName and characterId
     * @param serverName
     * @param characterId
     * @return {Promise.<*>}
     */
    async get(serverName, characterId) {
      const SQL = 'SELECT * FROM CHARACTERS WHERE UUID = ?';

      let _result = await $dbConnection.get(SQL, [serverName + ':' + characterId]);

      if(_result) {
        return _dtf.apply(this, [_result]);
      }
      else {
        return null;
      }
    }

    /***
     * Retrieve all (with filters, orderby and limit)
     * @param filters
     * @param orderby
     * @param limit
     * @return {Promise.<void>}
     */
    async getAll(filters, orderby, limit) {

      let SQL = 'SELECT * FROM CHARACTERS ';
      let params = [];

      //If there is no limit
      if(!limit) {
        limit = {
          'elementsPerPage': 20,
          'page': 0
        };
      }

      //If we have filters
      if(filters && typeof(filters) == 'object') {
        SQL += 'WHERE ';
        for(let key of Object.keys(filters)) {
          SQL += '?=? ';
          params.push(key);
          params.push(filters[key]);
        }
      }

      //If we have orderby
      if(orderby && typeof(orderby) == 'object') {
        SQL += 'ORDERBY ';
        for(let key of Object.keys(orderby)) {
          SQL += '? ?';
          params.push(key);
          params.push(orderby[key] == 'ASC' ? 'ASC' : 'DESC');
        }
      }

      SQL += 'LIMIT ?,?';
      params.push(limit.elementsPerPage * limit.page);
      params.push(limit.elementsPerPage * (limit.page + 1));

      let result = await $dbConnection.all(SQL, params);

      return result.map(_dtf);
    }

    /**
     * Updates a character (Create it or update)
     * @param character
     * @return {Promise.<*>}
     */
    async update(character) {

      //If object isn't valid
      if(!character) { return null; }

      //Exists character
      let _character = await this.get(character.serverName, character.characterId);

      //If character doesn't exist create it
      if(!_character) {
        return await _createCharacter(character);
      }
      //Else update it
      else {
        return await _updateCharacter(character);
      }
    }

    /**
     * Deletes a character form database
     * @param character
     * @return {Promise.<null>}
     */
    async delete(character) {

      //If object isn't valid
      if(!character) { return null; }

      const SQL = `DELETE FROM CHARACTERS WHERE UUID = ?`;

      await $dbConnection.run(SQL, [
        character.serverName + ':' + character.characterId
      ]);

    }
  }

  /**
   * Creates a character given an object
   * @param character
   * @return {Promise.<*>}
   * @private
   */
  async function _createCharacter(character) {
    const SQL = `INSERT INTO CHARACTERS 
      (UUID, SERVERNAME, CHARACTERID, PROFILE_PIC_URL, FACEBOOK_URL, TWITCH_URL, YOUTUBE_URL, MOUSECLICK_GEARCALC_URL, HIDE_OLD_NAMES, HIDE_OLD_LEGIONS)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await $dbConnection.run(SQL, [
      character.uuid,
      character.serverName,
      character.characterId,
      character.profile_pic_url,
      character.facebook_url,
      character.twitch_url,
      character.youtube_url,
      character.mouseClick_gearCalc_url,
      character.hide_old_names,
      character.hide_old_legions
    ]);

    return character;
  }

  /**
   * Updates a character
   * @param character
   * @return {Promise.<*>}
   * @private
   */
  async function _updateCharacter(character) {
    const SQL = `UPDATE CHARACTERS SET
      PROFILE_PIC_URL = ?,
      FACEBOOK_URL = ?,
      TWITCH_URL = ?,
      YOUTUBE_URL = ?,
      MOUSECLICK_GEARCALC_URL = ?,
      HIDE_OLD_NAMES = ?,
      HIDE_OLD_LEGIONS = ?
      WHERE UUID = ?`;

    await $dbConnection.run(SQL, [
      character.profile_pic_url,
      character.facebook_url,
      character.twitch_url,
      character.youtube_url,
      character.mouseClick_gearCalc_url,
      character.hide_old_names,
      character.hide_old_legions,
      character.uuid
    ]);

    return character;
  }

  /**
   * Data transform function
   * @param result
   * @return {Character}
   * @private
   */
  function _dtf(result) {

    let _character = new Character(result.serverName, result.characterId);

    _character.profile_pic_url = result.profile_pic_url;
    _character.facebook_url = result.facebook_url;
    _character.twitch_url = result.twitch_url;
    _character.youtube_url = result.youtube_url;
    _character.mouseClick_gearCalc_url = result.mouseClick_gearCalc_url;
    _character.hide_old_names = result.hide_old_names;
    _character.hide_old_legions = result.hide_old_legions;


    return _character;
  }

  module.exports = new CharacterService();

})();