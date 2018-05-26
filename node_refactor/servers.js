let $fs = require('../nodeApp/helpers').fs;
let $config = require('../nodeApp/config');
let $log = require('../nodeApp/helpers').log;
let $gameForge = require('../nodeApp/gameForge');
let $fsData = require('../nodeApp/fsData');
var $cache = require('../nodeApp/helpers').cache;
let colors = require('colors');

function Server() {}

/**
 * Refactor server files to set up serverId, serverName and date on em
 */
Server.prototype.update = function() {
  
  $cache.disable();
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
          _serverData.dates = {};

          if(i === 0) {
            _serverData.dates.next = _folderDates[i + 1];
          }
          else if(i === _folderDates.length - 1) {
            _serverData.dates.previous = _folderDates[i - 1];
          }
          else {
            _serverData.dates.next = _folderDates[i + 1];
            _serverData.dates.previous = _folderDates[i - 1];
          }
        
          await $fsData.server.store($$date, $$server.name, _serverData);
        } catch(error) {
          $log.error('Error processing %s/%s', $$date, $$server.name);
        }
      }

      if(_percent != _lastPercent) {
        $log.debug('Completed %s%', colors.cyan(_percent));
        _lastPercent = _percent;
      }
    }

    $cache.enable();
    resolve();
  });
}
module.exports = new Server();