/* global require, module */
module.exports = function() {

  let grunt = require('grunt');
  let $fsData = require('../nodeApp/fsData');
  let $config = require('../nodeApp/config');
  let $crawler = require('../nodeApp/crawler');
  let $gameForge = require('../nodeApp/gameForge');
  let $fs = require('../nodeApp/helpers').fs;
  let $log = require('../nodeApp/helpers').log;
  let $path = require('path');
  let moment = require('moment');
  let colors = require('colors');

  //Genrate folders.dates
  grunt.registerTask('generate-folder-dates', 'generate folders dates', async function() {
    let done = this.async();
    await $crawler.dates.generate();
    grunt.log.ok('Generated ' + $config.files.foldersDates.cyan + ' correctly');
    done();
  });

  //Crawler
  grunt.registerTask('crawler', 'does a crawler to gameforge server data', async function() {
    let done = this.async();

    let _loginCookie = await $crawler.server.login();
    let _currentDate = moment().format('MM-DD-YYYY');

    //Retrieve servers
    let _serversData = await _getServersData(_currentDate, _loginCookie);

    //Now update characters
    for(let $$serverData of _serversData) {
      await _updateServerCharacters($$serverData);
      await _updateCharactersThatAreNotListed($$serverData);
    }


    done();
  });

  //Get servers data
  function _getServersData(currentDate, cookie) {
    return new Promise(async (resolve, reject) => {

      let _dates = await $fsData.server.getDates();
      let _lastDate = _dates.pop();

      if(_lastDate == currentDate) { _lastDate = _dates.pop(); }

      //Generate folder to store servers if non exists
      try { await $fs.mkdir($path.join($config.folders.servers, currentDate)); } catch(error) {}

      let _serversData = [];

      for(let $$server of $gameForge.servers) {
        let _serverData = await $crawler.server.retrieveServer($$server.id, cookie);
        await $fsData.server.updateServerPreviousDate(_serverData);
        await $fsData.server.updateServerEntries(_serverData);
        await $fsData.server.updateServerStats(_serverData);
        await $fsData.server.store(currentDate, $$server.name, _serverData);

        //Get last server and update nextDate
        await $fsData.server.updateServerNextDate(await $fsData.server.get(_lastDate, $$server.name));

        _serversData.push(_serverData);
      }

      resolve(_serversData);
    });


  }

  //Update characters
  function _updateServerCharacters(serverData) {
    return new Promise(async (resolve, reject) => {
      let _t = (new Date()).getTime();

      for(let $$characterEntry of serverData.elyos.concat(serverData.asmodians)) {
        let _character = await $fsData.character.update(serverData.date, serverData.serverName, $$characterEntry.characterID, $$characterEntry);
        await $fsData.character.store(serverData.serverName, _character.characterID, _character);
      }

      let _dotsLength = 15 - serverData.serverName.length;

      $log.debug('Processed ranked characters %s:%s %s => %s [%s]',
        colors.cyan(serverData.date),
        colors.green(serverData.serverName),
        Array.apply(null, {'length': _dotsLength}).map(x => '.').join(''),
        colors.magenta( (new Date()).getTime() - _t + ' ms'),
        colors.yellow((process.memoryUsage().rss / 1024 / 1024 ).toFixed(2) + ' MB')
      );

      resolve();
    });
  }

  //Update characters that are not listed
  function _updateCharactersThatAreNotListed(serverData) {
    return new Promise(async (resolve, reject) => {
      let _t = (new Date()).getTime();

      let _serverCharacters = serverData.elyos.concat(serverData.asmodians);
      let _serverCharacterIDs = _serverCharacters.map(x => x.characterID);
      let _characterIDs = (await $fs.readdir($path.join($config.folders.characters, serverData.serverName))).map(x => parseInt(x.split('.')[0]));
      let _idsNotStored = _characterIDs.filter(x => _serverCharacterIDs.indexOf(x) < 0);

      for(let $$characterID of _idsNotStored) {
        let _character = await $fsData.character.update(serverData.date, serverData.serverName, $$characterID, null);
        await $fsData.character.store(serverData.serverName, _character.characterID, _character);
      }

      let _dotsLength = 15 - serverData.serverName.length;

      $log.debug('Processed unranked characters %s:%s %s => %s [%s]',
        colors.cyan(serverData.date),
        colors.green(serverData.serverName),
        Array.apply(null, {'length': _dotsLength}).map(x => '.').join(''),
        colors.magenta( (new Date()).getTime() - _t + ' ms'),
        colors.yellow((process.memoryUsage().rss / 1024 / 1024 ).toFixed(2) + ' MB')
      );

      resolve();
    });
  }

}();