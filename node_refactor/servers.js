let $fs = require('../nodeApp/helpers').fs;
let $config = require('../nodeApp/config');
let $log = require('../nodeApp/helpers').log;
let $gameForge = require('../nodeApp/gameForge');
let colors = require('colors');

function Server() {}

/**
 * Refactor server files to set up serverId, serverName and date on em
 */
Server.prototype.setIdAndNames = function() {
  return new Promise(async (resolve, reject) => {
    let _folderDates = await $fs.readdir($config.folders.servers);
    let _lastPercent = 0;

    _folderDates.sort((a, b) => (new Date(a).getTime() - (new Date(b).getTime())));

    for(let i = 0; i < _folderDates.length; i++) {
      let $$dateFolder = _folderDates[i];
      let _servers = await $fs.readdir($config.folders.servers + $$dateFolder);
      let _percent = Math.floor(i * 100 / _folderDates.length);

      for(let $$serverFile of _servers) {
        let _serverFileFullName = $config.folders.servers + $$dateFolder + '/' + $$serverFile;
        let _serverName = $$serverFile.substr(0, $$serverFile.length - 5);
        var _serverEntry = $gameForge.servers.filter(x => x.name == _serverName).shift();

        if(!_serverEntry) { continue; }
        let _serverId = _serverEntry.id;

        let _server = null;

        try {
          _server = await $fs.readJSON(_serverFileFullName);
        } catch(error) {
          $log.error('Coundn\'t read %s', _serverFileFullName);
          continue;
        }

        _server.serverId = _serverId;
        _server.serverName = _serverName;
        _server.date = $$dateFolder;

        try {
          await $fs.writeJSON(_serverFileFullName, _server);
        } catch(error) {
          $log.error('Couldn\'t write on %s', _serverFileFullName);
        }
      }

      if(_percent % 5 === 0 && _percent != _lastPercent) {
        $log.debug('Completed %s%', colors.cyan(_percent));
        _lastPercent = _percent;
      }
    }
  });
}
module.exports = new Server();