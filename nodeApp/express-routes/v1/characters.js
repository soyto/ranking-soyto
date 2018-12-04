(() => {
  const express = require('express');

  const passportJwt = require('./authorization/passport-jwt');
  const $expressHelper = require('../../helpers').express;
  const characterService = require('../../services').character;
  const Pagination = require('../../helpers').SQL.Pagination;

  let router = express.Router();

  /**
   * Gets a character given a serverName and characterId
   */
  router.get('/:serverName/:characterId', async (req, res) => {
    try {
      let serverName = req.params.serverName;
      let characterId = req.params.characterId;

      if (!serverName || !characterId) {
        return $expressHelper.notValid(res, 'required serverName and characterId params');
      }

      let character = await characterService.get(serverName, characterId);

      if (!character) {
        return $expressHelper.notFound(res);
      }

      res.json(_dtf(character));
    } catch(error) {
      return $expressHelper.error(res, error);
    }
  });

  /**
   * Get all route
   */
  router.get('/',passportJwt.authorize('ADMIN'), async(req, res) => {

    try {
      let filter = null;
      let orderby = null;

      //If we don't undestand page param
      if(req.query.page && (isNaN(parseInt(req.query.page)) || parseInt(req.query.page) < 0)) {
        return $expressHelper.notValid(res, 'page is not valid numeric value');
      }

      //Pagination object
      let pagination = req.query.page ? new Pagination(20, parseInt(req.query.page)) : new Pagination(20, 0);

      let _records = await characterService.getAll(filter, orderby, pagination);

      let _result = {
        'records': _records.map(_dtf),
      };

      res.json(_result);
    } catch(error) {
      return $expressHelper.error(res, error);
    }
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