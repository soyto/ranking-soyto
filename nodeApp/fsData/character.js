let $fs = require('../helpers').fs;
let $config = require('../config');
let $log = require('../helpers').log;
let $path = require('path');
let colors = require('colors');

function Character() {}

/**
 * Reads a character
 * @param {*} serverName
 * @param {*} characterID
 */
Character.prototype.get = function(serverName, characterID) {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(await $fs.readJSON($path.join($config.folders.characters, serverName, characterID + '.json')));
    } catch (error) {
      if(error && error.code == 'ENOENT') { return resolve(null); }
      else if(error && error.message == 'Unexpected end of JSON input') {
        $log.warn('[%s] was malformed', $path.join($config.folders.characters, serverName, characterID + '.json'));
        return resolve(null);
      }
      else { return reject(error); }
    }
  });
};

/**
 * Stores a character
 * @param {*} serverName
 * @param {*} characterID
 * @param {*} characterData
 */
Character.prototype.store = function(serverName, characterID, characterData) {
  return new Promise(async (resolve, reject) => {
    try {

      let _filePath = $path.join($config.folders.characters, serverName, characterID + '.json');

      return resolve(await $fs.writeJSON(_filePath, characterData, $config.fsData.prettyPrint));
    } catch(error) {

      if(error.code == 'ENOENT') {
        try {
          await $fs.mkdir($path.join($config.folders.characters, serverName));
          return resolve(this.store(serverName, characterID, characterData));
        } catch(error) {
          return reject(error);
        }
      }
      return reject(error);
    }
  });
};

/**
 * Update a character (or create new) with a dataEntry
 * @param {*} date 
 * @param {*} serverName 
 * @param {*} dataEntry 
 */
Character.prototype.update = function(date, serverName, characterID, dataEntry) {
  return new Promise(async (resolve, reject) => {
    try {

      //Retrieve character
      let _character = await this.get(serverName, characterID);

      if(_character && dataEntry) {
        return resolve(_updateCharacter(date, serverName, characterID, _character, dataEntry));
      }
      else if(!_character && dataEntry) {
        return resolve(_generateCharacter(date, serverName, characterID, dataEntry));
      }
      else if(!_character && !dataEntry) {
        return resolve(null);
      }
      else if(_character && !dataEntry) {
        return resolve(_updateCharacter(date, serverName, characterID, _character));
      }

    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Generates character sheets
 */
Character.prototype.generateCharactersSheet = function() {
  return new Promise(async (resolve, reject) => {

    let _wholeData = [];
    let _folders = await $fs.readdir($config.folders.characters);


    for(let _folder of _folders) {
      let _t = (new Date()).getTime();
      let _characters = await $fs.readdir($path.join($config.folders.characters, _folder));

      for(let $$character of _characters) {
        let _characterInfo = null;

        try {
          _characterInfo = await $fs.readJSON($path.join($config.folders.characters, _folder, $$character));
        } catch(error) {
          $log.error('Error processing %s/%s', _folder, $$character);
          continue;
        }

        let _character = {
          'id': _characterInfo.characterID,
          'characterName': _characterInfo.characterName,
          'characterClassID': _characterInfo.characterClassID,
          'characterRaceID': _characterInfo.raceID,
          'characterPosition': _characterInfo.position,
          'characterSoldierRankID': _characterInfo.soldierRankID,
          'serverName': _characterInfo.serverName,
          'lastStatus': null
        };

        let _d = new Date(_characterInfo['status'][_characterInfo['status'].length -1]['date']);
        _character.lastStatus = parseInt(_d.getTime()) / 1000;

        _wholeData.push(_character);
      }

      $log.debug('Reading all characters from [%s] completed in %sms', colors.cyan(_folder), colors.green((new Date()).getTime() - _t));
    }

    //Sort em
    _wholeData.sort(function(a, b){
      return a['characterName'].localeCompare(b['characterName']);
    });

    let o2x = require('object-to-xml');

    await $fs.writeJSON($path.join($config.folders.appData, 'charactersSheet.json'), _wholeData);
    await $fs.write($path.join($config.folders.appData, 'charactersSheet.xml'), o2x({
      '?xml version=\"1.0\" encoding=\"iso-8859-1\"?' : null,
      'characters': {
        'character': _wholeData
      }
    }));

    resolve(_wholeData);
  });
};

/**
 * Generates a character
 * @param {*} date 
 * @param {*} serverName 
 * @param {*} characterID 
 * @param {*} dataEntry 
 */
function _generateCharacter(date, serverName, characterID, dataEntry) {

  let _character = {
    'characterID': characterID,
    'serverName': serverName,
    'last_update': date,
    'characterClassID': dataEntry.characterClassID,
    'raceID': dataEntry.raceID,

    'position': dataEntry.position,
    'rankingPositionChange': dataEntry.rankingPositionChange,
    'gloryPoint': dataEntry.gloryPoint,
    'gloryPointChange': 0,
    'soldierRankID': dataEntry.soldierRankID,

    'characterName': dataEntry.characterName,
    'guildName': dataEntry.guildName,
    'guildID': dataEntry.guildID,

    'status': [],
    'names': [],
    'guilds': []
  };

  _character.status.push({
    'date': date,
    'position': dataEntry.position,
    'rankingPositionChange': dataEntry.rankingPositionChange,
    'gloryPoint': dataEntry.gloryPoint,
    'gloryPointChange': 0,
    'soldierRankID': dataEntry.soldierRankID
  });

  _character.names.push({
    'date': date,
    'characterName': dataEntry.characterName,
  });

  _character.guilds.push({
    'date': date,
    'guildName': dataEntry.guildName,
    'guildID': dataEntry.guildID
  });

  return _character;
}

/**
 * Update character
 * @param {*} date 
 * @param {*} serverName 
 * @param {*} characterID 
 * @param {*} character 
 * @param {*} dataEntry 
 */
function _updateCharacter(date, serverName, characterID, character, dataEntry) {
  let _currentCharacterDate = (new Date(character.last_update)).getTime();
  let _newDate = (new Date(date)).getTime();

  //If new date is older or same than current date
  if(_newDate <= _currentCharacterDate) { return character; }

  //If is not an update
  if(!dataEntry) {
    character.last_update = date;

    character.position = -1;
    character.rankingPositionChange = -1;
    character.gloryPointChange = -1;
    character.soldierRankID = 9;

  }
  else {
    character.last_update = date;

    character.position = dataEntry.position;
    character.rankingPositionChange = dataEntry.rankingPositionChange;
    character.gloryPoint = dataEntry.gloryPoint;
    character.gloryPointChange = dataEntry.gloryPointChange;
    character.soldierRankID = dataEntry.soldierRankID;

    character.characterName = dataEntry.characterName;

    character.guildName = dataEntry.guildName;
    character.guildID = dataEntry.guildID;

    character.status.push({
      'date': date,
      'position': dataEntry.position,
      'rankingPositionChange': dataEntry.rankingPositionChange,
      'gloryPoint': dataEntry.gloryPoint,
      'gloryPointChange': dataEntry.gloryPointChange,
      'soldierRankID': dataEntry.soldierRankID
    });

    //If there are more than 50 status
    if(character.status.length > 50) {
      character.status.splice(0, character.status.length - 50);
    }

    let _lastName = character.names[character.names.length - 1];
    let _lastGuild = character.guilds[character.guilds.length - 1];

    if(_lastName.characterName != dataEntry.characterName) {
      character.names.push({
        'date': date,
        'characterName': dataEntry.characterName,
      });
    }

    if(_lastGuild.guildID != dataEntry.guildID) {
      character.guilds.push({
        'date': date,
        'guildName': dataEntry.guildName,
        'guildID': dataEntry.guildID
      });
    }
  }

  return character;
}

module.exports = new Character();