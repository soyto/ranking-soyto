let $fs = require('../helpers').fs;
let $config = require('../config');
let $log = require('../helpers').log;
let $gameForge = require('../gameForge');
let $fsData = require('../fsData');
let colors = require('colors');

function Server() {}

/**
 * Refactor server files to set up serverId, serverName and date on em
 */
Server.prototype.update = function() {
  return new Promise(async (resolve, reject) => {
    let _folderDates = await $fsData.server.getDates();
    let _lastPercent = -1;

    for(let i = 0; i < _folderDates.length; i++) {
      let $$date = _folderDates[i];
      let _percent = Math.floor(i * 100 / _folderDates.length);

      for(let $$server of $gameForge.servers) {
        try {
          let _serverData = await $fsData.server.get($$date, $$server.name);

          _serverData.serverId = $$server.id;
          _serverData.serverName = $$server.name;
          _serverData.date = $$date;
          await $fsData.server.updateServerPreviousDate(_serverData);
          await $fsData.server.updateServerNextDate(_serverData);
          await $fsData.server.updateServerEntries(_serverData);
          await $fsData.server.updateServerStats(_serverData);
          await $fsData.server.store($$date, $$server.name, _serverData);
        } catch(error) {
          $log.error('Error processing %s/%s', $$date, $$server.name);
        }
      }

      if(_percent != _lastPercent) {
        $log.debug('Completed %s% [%s:%s]', colors.cyan(_percent), colors.magenta(i + 1), colors.green(_folderDates.length));
        _lastPercent = _percent;
      }
    }
    resolve();
  });
};
module.exports = new Server();