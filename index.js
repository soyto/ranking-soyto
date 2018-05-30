var $crawler = require('./nodeApp/crawler');
var $gameForge = require('./nodeApp/gameForge');
var $refactor = require('./nodeApp/refactor');
var $fsData = require('./nodeApp/fsData');
var $log = require('./nodeApp/helpers').log;
var $fs = require('./nodeApp/helpers').fs;
var $config = require('./nodeApp/config');
var colors = require('colors');
var path = require('path');

(async function() {
  let _dates = await $fsData.server.getDates();

  for(let _date of _dates) {
    console.log('Date -> %s', _date);
    let _serverInfo = await $fsData.server.get(_date, 'Antriksha');

    for(let $$characterEntry of _serverInfo.elyos.concat(_serverInfo.asmodians)) {
      let _character = await $fsData.character.update(_serverInfo.date, _serverInfo.serverName, $$characterEntry.characterID, $$characterEntry);
      await $fsData.character.store(_serverInfo.serverName, _character.characterID, _character);
    }
  }

})();