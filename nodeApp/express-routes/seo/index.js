/* global require, module, __dirname */
const fs = require('fs');
const $fs = require('../../helpers').fs;
const $log = require('../../helpers').log;
const $config = require('../../config');
const express = require('express');
const $path = require('path');

let router = express.Router();

//Main route
router.get('/', async (req, res) => {
  try {
    res.send(await $fs.read($path.join($config.folders.www, 'index.html')));
  } catch(error) {
    $log.error('Error -> %o', error);
    return res.status(500);
  }
});

fs.readdirSync(__dirname).forEach(file => {

  //We only want .js files
  if(!file.endsWith('.js')) { return; }

  let _name = file.substr(0, file.length - 3);

  //If name is index, avoid
  if(_name == 'index') { return; }

  //If recieve scaped fragment... remove it
  router.use((req, res, next) => {
    req.url = decodeURIComponent(req.url.replace('/?_escaped_fragment_=', ''));
    next();
  });

  router.use('/' + _name, require($path.join(__dirname, file)));
});



module.exports = router;

