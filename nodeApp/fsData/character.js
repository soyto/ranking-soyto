let $fs = require('../helpers').fs;
let $config = require('../config');
let $log = require('../helpers').log;
let $path = require('path');

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
      return reject(error);
    }
  });
};

module.exports = new Character();