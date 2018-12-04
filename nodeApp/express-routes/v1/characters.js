(() => {
  const express = require('express');

  const passportJwt = require('./authorization/passport-jwt');
  const $expressHelper = require('../../helpers').express;
  const characterService = require('../../services').character;

  let router = express.Router();

  /**
   * Gets a character given a serverName and characterId
   */
  router.get('/:serverName/:characterId', async (req, res) => {
    let serverName = req.params.serverName;
    let characterId = req.params.characterId;

    if(!serverName || !characterId) {
      return $expressHelper.notValid(res, 'required serverName and characterId params');
    }

    let character = await characterService.get(serverName, characterId);

    if(!character) {
      return $expressHelper.notFound(res);
    }

    res.json(_dtf(character));
  });


  function _dtf(record) {
    return {
      'serverName': record.serverName,
      'characterId': record.characterId,
      'profile_pic_url': record.profile_pic_url,
      'facebook_url': record.facebook_url,
      'twitch_url': record.twitch_url,
      'youtube_url': record.youtube_url,
      'mouseClick_gearCalc_url': record.mouseClick_gearCalc_url,
      'hide_old_names': record.hide_old_names,
      'hide_old_legions': record.hide_old_legions
    };
  }


  module.exports = router;
})();