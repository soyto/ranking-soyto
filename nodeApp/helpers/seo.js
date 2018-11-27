const util = require('util');
const $gameforge = require('../gameForge');

function SEO() {}

SEO.prototype.index = {};
SEO.prototype.twitch = {};
SEO.prototype.ranking = {};
SEO.prototype.character = {};


/**
 * Retrieve what are site keywords
 * @return {string}
 */
SEO.prototype.keywords = function() {
  return 'soyto aion ranking pvp characters';
};

/**
 * SEO title for index
 * @return {string}
 */
SEO.prototype.index.title = function() {
  return 'Soyto\'s Aion ranking tool';
};

/**
 * SEO Description for index
 * @return {string}
 */
SEO.prototype.index.description = function() {
  return 'Soyto\'s tool for Aion PvP ranking on EU servers. \nLook for a character and see a lot of info related about it!';
};


/**
 * Title
 * @return {string}
 */
SEO.prototype.twitch.title = function() {
  return 'Twitch Channels | Soyto\'s Aion ranking tool';
};

/**
 * Description
 * @return {string}
 */
SEO.prototype.twitch.description = function() {
  return 'Twitch channels associated with each character on Soyto\'s character ranking';
};

/**
 * Title
 * @return {string}
 */
SEO.prototype.ranking.title = function(serverData) {
  return util.format('%s -> %s | Soyto\'s Aion ranking tool', serverData.serverName, serverData.date);
};

/**
 * Description
 * @return {string}
 */
SEO.prototype.ranking.description = function(serverData) {

  if(serverData.elyos.length === 0 && serverData.asmodians.length === 0) {
    return util.format('%s at \'%s\'', serverData.serverData, serverData.date);
  }
  else if(serverData.elyos.length === 0) {
    return util.format('%s at \'%s\' Asmodian governor %s (%s)',
      serverData.serverData,
      serverData.date,
      serverData.asmodians[0].characterName,
      $gameforge.classes.get(serverData.asmodians[0].characterClassID)
    );
  }
  else if(serverData.asmodians.length === 0) {
    return util.format('%s at \'%s\' Elyos governor %s (%s)',
      serverData.serverData,
      serverData.date,
      serverData.elyos[0].characterName,
      $gameforge.classes.get(serverData.elyos[0].characterClassID)
    );
  }
  else {
    return util.format('%s at \'%s\' Governors: %s (%s) and %s (%s)',
      serverData.serverName,
      serverData.date,
      serverData.elyos[0].characterName,
      $gameforge.classes.get(serverData.elyos[0].characterClassID),
      serverData.asmodians[0].characterName,
      $gameforge.classes.get(serverData.asmodians[0].characterClassID),
    );
  }
};

/**
 * Keywords
 * @param serverData
 */
SEO.prototype.ranking.keywords = function(serverData) {
  return util.format('soyto aion ranking pvp characters %s %s %s %s',
    serverData.elyos.length > 0 ? serverData.elyos[0].characterName: '',
    serverData.elyos.length > 0 ? $gameforge.classes.get(serverData.elyos[0].characterClassID): '',
    serverData.asmodians.length > 0 ? serverData.asmodians[0].characterName : '',
    serverData.asmodians.length > 0 ? $gameforge.classes.get(serverData.asmodians[0].characterClassID) : '',
  );
};

/**
 * Title
 * @return {string}
 */
SEO.prototype.character.title = function(characterData) {
  return util.format('%s (%s) | Soyto\'s Aion ranking tool', characterData.characterName, characterData.serverName);
};

/**
 * Description
 * @return {string}
 */
SEO.prototype.character.description = function(characterData) {

  let _raceName = characterData.raceID == 0 ? 'Elyos' : 'Asmodian';

  //If character haven't a guild
  if(!characterData.guildID) {
    return util.format('%s, an %s %s %s without guild from server %s',
      characterData.characterName,
      _raceName,
      $gameforge.ranking.get(characterData.soldierRankID),
      $gameforge.classes.get(characterData.characterClassID),
      characterData.serverName
    );
  }
  else {
    return util.format('%s, an %s %s %s from %s in server %s',
      characterData.characterName,
      _raceName,
      $gameforge.ranking.get(characterData.soldierRankID),
      $gameforge.classes.get(characterData.characterClassID),
      characterData.guildName,
      characterData.serverName
    );
  }
};

/**
 * Keywords
 * @param serverData
 */
SEO.prototype.character.keywords = function(characterData) {
  let _raceName = characterData.raceID == 0 ? 'Elyos' : 'Asmodian';

  return util.format('soyto aion ranking pvp characters %s',
    [ characterData.characterName,
      characterData.serverName,
      characterData.guildName,
      _raceName,
      $gameforge.ranking.get(characterData.soldierRankID),
      $gameforge.classes.get(characterData.characterClassID),
    ].join(' ')
  );
};



module.exports = new SEO();