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
  await $fs.rmdir($config.folders.characters, true);
  let $character = await $fsData.character.get('Antriksha', 1228);
})();