(() => {
  const express = require('express');

  const passportJwt = require('./authorization/passport-jwt');
  const $expressHelper = require('../../helpers').express;
  const characterService = require('../../services').character;
  const NotNullFilter = require('../../helpers').SQL.filters.NotNull;
  const fsCharacter = require('../../fsData').character;

  let router = express.Router();

  /**
   * Retrieve all twitch characters
   */
  router.get('/', async (req, res) => {

    let _results = [];
    let _records = await characterService.getAll([new NotNullFilter('twitch_url')], null, {'elementsPerPage': 9999, 'page': 0});


    for(let _character of _records) {
      let _fsCharacter = await fsCharacter.get(_character.serverName, _character.characterId);

      //If fs Character doesnt exists, just omit it
      if(!_fsCharacter) { continue; }

      _fsCharacter.social = {};

      if(_character.profile_pic_url) { _fsCharacter.pictureURL = _character.profile_pic_url; }
      else { _fsCharacter.pictureURL = '//placehold.it/450X300/DD66DD/EE77EE/?text=' + _fsCharacter.characterName; }
      if(_character.facebook_url) { _fsCharacter.social.facebook = _character.facebook_url; }
      if(_character.twitch_url) { _fsCharacter.social.twitch = _character.twitch_url; }
      if(_character.youtube_url) { _fsCharacter.social.youtube = _character.youtube_url; }
      if(_character.mouseClick_gearCalc_url) { _fsCharacter.social.mouseClick_gearCalcID = _character.mouseClick_gearCalc_url; }

      delete _fsCharacter.status;
      delete _fsCharacter.names;
      delete _fsCharacter.guilds;

      _results.push(_fsCharacter);
    }

    res.json(_results);
  });


  module.exports = router;
})();