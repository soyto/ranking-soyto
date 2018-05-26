var $crawler = require('./nodeApp/crawler');
var $gameForge = require('./nodeApp/gameForge');


(async function() {
  try {
  let _cookie = await $crawler.server.login();
  console.log('Cookies is %s', _cookie);  
  
  for(let server of $gameForge.servers) {
    let _serverPage = await $crawler.server.retrieveServer(server.id, _cookie);
  }
  
  
  } catch(error) {
    
  }
})();