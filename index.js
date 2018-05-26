var $crawler = require('./nodeApp/crawler');
var $gameForge = require('./nodeApp/gameForge');
var $refactor = require('./node_refactor');
var $fsData = require('./nodeApp/fsData');
var $log = require('./nodeApp/helpers').log;
var colors = require('colors');

(async function() {
  await $refactor.servers.update();
})();