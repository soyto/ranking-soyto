var $crawler = require('./nodeApp/crawler');
var $gameForge = require('./nodeApp/gameForge');


(async function() {
  await $crawler.dates.generate();
  console.log('all done');
})();