let $fs = require('../helpers').fs;
let $config = require('../../config');
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

      for(let $$server of $gameForge.servers) {
        try {
          let _t = (new Date()).getTime();
          let _serverData = await $fsData.server.get($$date, $$server.name);

          _serverData.serverId = $$server.id;
          _serverData.serverName = $$server.name;
          _serverData.date = $$date;
          await $fsData.server.updateServerPreviousDate(_serverData);
          await $fsData.server.updateServerNextDate(_serverData);
          await $fsData.server.updateServerEntries(_serverData);
          await $fsData.server.updateServerStats(_serverData);
          await $fsData.server.store($$date, $$server.name, _serverData);

          let _dotsLength = 15 - $$server.name.length;

          $log.debug('Processed %s:%s  %s => %s [%s]',
            colors.cyan($$date),
            colors.green($$server.name),
            Array.apply(null, {'length': _dotsLength}).map(x => '.').join(''),
            colors.magenta( (new Date()).getTime() - _t + ' ms'),
            colors.yellow((process.memoryUsage().rss / 1024 / 1024 ).toFixed(2) + ' MB')
          );
        } catch(error) {
          $log.error('Error processing %s/%s', $$date, $$server.name);
        }
      }
    }
    resolve();
  });
};

module.exports = new Server();