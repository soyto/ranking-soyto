/* global require, module, __dirname */
const fs = require('fs');
const $fs = require('../../helpers').fs;
const $log = require('../../helpers').log;
const $config = require('../../config');
const express = require('express');
const $path = require('path');
const Handlebars = require('handlebars');

let router = express.Router();

fs.readdirSync(__dirname).forEach(file => {

  //We only want .js files
  if(!file.endsWith('.js')) { return; }

  let _name = file.substr(0, file.length - 3);

  //If name is index, avoid
  if(_name == 'index') { return; }

  router.use('/' + _name, require($path.join(__dirname, file)));
});

router.get('/', async (req, res) =>  {
  try {
    let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'scrapper', 'index.hbs')));

    let _result = _template();

    return res.send(_result);
  } catch(error) {
    $log.error('Error > %o', error);
    return res.status(500);
  }
});


router.use('/', express.static('www'));

module.exports = router;

