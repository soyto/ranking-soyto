var $crawler = require('./nodeApp/crawler');
var $gameForge = require('./nodeApp/gameForge');
var $refactor = require('./node_refactor');


(async function() {
   await $refactor.servers.setIdAndNames();
})();