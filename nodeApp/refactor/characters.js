let $fs = require('../helpers').fs;
let $config = require('../config');
let $log = require('../helpers').log;
let $fsData = require('../fsData');
let colors = require('colors');
var $path = require('path');

function Character() {}

/**
 * Refactor server files to set up serverId, serverName and date on em
 */
Character.prototype.update = function() {
  return new Promise(async (resolve, reject) => {

    //First of all, remove all Characters folder
    try {
      //Try to remove folders characters
      try { await $fs.rmdir($config.folders.characters, true); } catch(error) {}
      await $fs.mkdir($config.folders.characters);
    } catch(error) {
      return reject(error);
    }

    let _dates = await $fsData.server.getDates();

    for (let _date of _dates) {
      let _servers = await $fs.readdir($path.join($config.folders.servers, _date));

      for(let _server of _servers.map(x => x.split('\.')[0])) {
        let _t = (new Date()).getTime();

        let _serverInfo = await $fsData.server.get(_date, _server);

        if(!_serverInfo || !_serverInfo.serverName) { continue; }

        for(let $$characterEntry of _serverInfo.elyos.concat(_serverInfo.asmodians)) {
          let _character = await $fsData.character.update(_serverInfo.date, _serverInfo.serverName, $$characterEntry.characterID, $$characterEntry);
          await $fsData.character.store(_serverInfo.serverName, _character.characterID, _character);
        }

        let _dotsLength = 15 - _server.length;

        $log.debug('Processed %s:%s %s => %s [%s]',
          colors.cyan(_date),
          colors.green(_server),
          Array.apply(null, {'length': _dotsLength}).map(x => '.').join(''),
          colors.magenta( (new Date()).getTime() - _t + ' ms'),
          colors.yellow((process.memoryUsage().rss / 1024 / 1024 ).toFixed(2) + ' MB')
        );
      }

    }
  });
};

module.exports = new Character();