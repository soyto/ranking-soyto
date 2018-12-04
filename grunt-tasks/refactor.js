module.exports = (function() {

  let grunt = require('grunt');
  let $refactor = require('../nodeApp/refactor');
  const $dbConnection = require('../nodeApp/services').database.connection;
  const Character = require('../nodeApp/models').Character;
  const characterService = require('../nodeApp/services').character;
  const $fs = require('../nodeApp/helpers').fs;
  const $config = require('../config');
  const $path = require('path');

  /**
   * Refactor task
   */
  grunt.registerTask('refactor', 'refactor some data, usage: refactor:servers', function() {
    let _done = this.async();
    switch(this.args[0]) {

      case 'servers':
        $refactor.servers.update().then(_done);
        break;

      case 'characters':
        $refactor.characters.update().then(_done);
        break;

        default:
        grunt.log.warn('usage: refactor:servers');
    }
  });

  grunt.registerTask('refactor_data', 'refactor deprecated data', async function() {
    let _done = this.async();

    await $dbConnection.init();
    await _setUpCharacterPics();
    await _setUpCharacterSocial();
    await _setUpCharacterHideOldNames();
    await _setUpCharacterHideOldLegions();

    _done();
  });

  /**
   * Set up character pics
   * @return {Promise.<void>}
   * @private
   */
  async function _setUpCharacterPics() {
    let _baseFolder = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data');
    let _characters = await $fs.readJSON($path.join(_baseFolder, 'characterPics.json'));

    for(let record of _characters) {

      let character = await characterService.get(record.serverName, record.characterID);

      if(!character) {
        character = new Character(record.serverName, record.characterID);
      }

      character.profile_pic_url = record.pic;

      grunt.log.ok('Setting character pic to %s', character.uuid);
      await characterService.update(character);
    }
  }

  /**
   * Set up character social
   * @return {Promise.<void>}
   * @private
   */
  async function _setUpCharacterSocial() {
    let _baseFolder = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data');
    let _characters = await $fs.readJSON($path.join(_baseFolder, 'characterSocial.json'));

    for(let record of _characters) {
      let character = await characterService.get(record.serverName, record.characterID);

      if(!character) {
        character = new Character(record.serverName, record.characterID);
      }

      if(record.buttons.facebook) {
        character.facebook_url = record.buttons.facebook;
      }

      if(record.buttons.youtube) {
        character.youtube_url = record.buttons.youtube;
      }

      if(record.buttons.twitch) {
        character.twitch_url = record.buttons.twitch;
      }

      if(record.buttons.mouseClick_gearCalcID) {
        character.mouseClick_gearCalc_url = record.buttons.mouseClick_gearCalcID;
      }


      grunt.log.ok('Setting character social to %s', character.uuid);
      await characterService.update(character);
    }
  }

  /**
   * Set up ccharacter hide old names
   * @return {Promise.<void>}
   * @private
   */
  async function _setUpCharacterHideOldNames() {
    let _baseFolder = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data');
    let _characters = await $fs.readJSON($path.join(_baseFolder, 'oldNameRemoval.json'));

    for(let record of _characters) {
      let character = await characterService.get(record.serverName, record.characterID);

      if (!character) {
        character = new Character(record.serverName, record.characterID);
      }

      character.hide_old_names = true;

      grunt.log.ok('Hide old names to %s', character.uuid);
      await characterService.update(character);
    }
  }

  /**
   * Set up character hide old legion names
   * @return {Promise.<void>}
   * @private
   */
  async function _setUpCharacterHideOldLegions() {
    let _baseFolder = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data');
    let _characters = await $fs.readJSON($path.join(_baseFolder, 'oldLegionRemoval.json'));

    for(let record of _characters) {
      let character = await characterService.get(record.serverName, record.characterID);

      if (!character) {
        character = new Character(record.serverName, record.characterID);
      }

      character.hide_old_legions = true;

      grunt.log.ok('Hide old legions to %s', character.uuid);
      await characterService.update(character);
    }
  }

})();