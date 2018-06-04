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
  let _characterData = await $fsData.character.get(req.params.serverName, req.params.characterId);
  let _characterPic = (await $fs.readJSON($config.files.characterPics)).filter(x => x.characterID == req.params.characterID && x.serverName == req.params.serverName).shift();
  let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'seo', 'characterInfo_share.hbs')));
  
  let _picture = null;

  if(_characterPic) {
    _picture = _characterPic.pic;
  }
  else if(_characterData) {
    _picture = '//placehold.it/450X300/DD66DD/EE77EE/?text=' + encodeURI(_characterData.characterName);
  }
  else {
    _picture = '//placehold.it/450X300/DD66DD/EE77EE/?text=NotFound';
  }

  let _result = _template({
    'character': _characterData,
    'picture': _picture
  });

  res.send(_result);
});


module.exports = router;