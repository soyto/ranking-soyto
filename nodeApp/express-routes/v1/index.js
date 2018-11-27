(() => {

  const fs = require('fs');
  const express = require('express');
  const $path = require('path');

  let router = express.Router();

  fs.readdirSync(__dirname).forEach(file => {

    //We only want .js files
    if(!file.endsWith('.js')) { return; }

    let _name = file.substr(0, file.length - 3);

    //If name is index, avoid
    if(_name == 'index') { return; }

    router.use('/' + _name, require($path.join(__dirname, file)));
  });


  module.exports = router;
})();