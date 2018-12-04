(() => {
  const $fs = require('../../helpers').fs;
  const $path = require('path');
  const $config = require('../../../config');
  const $fsData = require('../../fsData');
  const $log = require('../../helpers').log;
  const $seo = require('../../helpers').seo;
  const express = require('express');
  const Handlebars = require('handlebars');
  const characterService = require('../../services').character;

  let router = express.Router();


  /**
   * Print handlebars template
   */
  router.get('/:serverName/:characterID', async (req, res) => {

    try {
      let _characterData = await $fsData.character.get(req.params.serverName, req.params.characterID);

      if (!_characterData) {
        return res.status(404).end();
      }

      let _dbCharacterData = await characterService.get(req.params.serverName, req.params.characterID);

      let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'scrapper', 'characterInfo.hbs')));

      let _result = _template({
        'title': $seo.character.title(_characterData),
        'description': $seo.character.description(_characterData),
        'keywords': $seo.character.keywords(_characterData),
        'character': _characterData,
        'picture': _getPicture(_dbCharacterData.profile_pic_url, _characterData),
      });

      res.send(_result);

    } catch (error) {
      $log.error('Error > %o', error);
      return res.status(500).end();
    }
  });

  function _getPicture(characterPic, characterData) {
    if (characterPic) {
      return characterPic;
    }
    else if (characterData) {
      return '//placehold.it/450X300/DD66DD/EE77EE/?text=' + encodeURI(characterData.characterName);
    }
    else {
      return '//placehold.it/450X300/DD66DD/EE77EE/?text=NotFound';
    }
  }


  module.exports = router;

})();
