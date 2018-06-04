const $fs = require('../../helpers').fs;
const $path = require('path');
const $config = require('../../config');
const $fsData = require('../../fsData');
const $log = require('../../helpers').log;
const express = require('express');
const Handlebars = require('handlebars');

let router = express.Router();


/**
 * Print handlebars template
 */
router.get('/:serverName/:characterID', async (req, res) => {
  let _characterData = await $fsData.character.get(req.params.serverName, req.params.characterID);
  let _characterPic = (await $fs.readJSON($config.files.characterPics)).filter(x => x.characterID == req.params.characterID && x.serverName == req.params.serverName).shift();
  let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'seo', 'characterInfo_share.hbs')));

  let _result = _template({
    'character': _characterData,
    'picture': _getPicture(_characterPic, _characterData),
    'description': _getDescription(_characterData)
  });

  res.send(_result);
});

function _getPicture(characterPic, characterData) {
  if(characterPic) {
    return characterPic.pic;
  }
  else if(characterData) {
    return '//placehold.it/450X300/DD66DD/EE77EE/?text=' + encodeURI(characterData.characterName);
  }
  else {
    return '//placehold.it/450X300/DD66DD/EE77EE/?text=NotFound';
  }
}

function _getDescription(characterData) {
  let _raceName = characterData.raceID == 0 ? 'Elyos' : 'Asmodian';
  let _className = null;
  let _rankName = null;
  let _guildName = characterData.guildName ? 'of ' + characterData.guildName : 'without guild';

  switch(characterData.characterClassID) {
    case 1: _className = 'Gladiator'; break;
    case 2: _className = 'Templar'; break;
    case 4: _className = 'Assassin'; break;
    case 5: _className = 'Ranger'; break;
    case 7: _className = 'Sorcerer'; break;
    case 8: _className = 'Spiritmaster'; break;
    case 10: _className = 'Cleric'; break;
    case 11: _className = 'Chanter'; break;
    case 13: _className = 'Aethertech'; break;
    case 14: _className = 'Gunner'; break;
    case 16: _className = 'Bard'; break;
  }

  switch(characterData.soldierRankID) {
    case 10: _rankName = 'Army 1-Star Officer'; break;
    case 11: _rankName = 'Army 2-Star Officer'; break;
    case 12: _rankName = 'Army 3-Star Officer'; break;
    case 13: _rankName = 'Army 4-Star Officer'; break;
    case 14: _rankName = 'Army 5-Star Officer'; break;
    case 15: _rankName = 'General'; break;
    case 16: _rankName = 'Great General'; break;
    case 17: _rankName = 'Commander'; break;
    case 18: _rankName = 'Governor'; break;
    default: _rankName = 'Soldier Rank 1'; break;
  }

  return _raceName + ' ' + _rankName + ' ' + _className + '' + _guildName;
}


module.exports = router;