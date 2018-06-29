/* global require, module, __dirname */
const fs = require('fs');
const $fs = require('../../helpers').fs;
const $log = require('../../helpers').log;
const $seo = require('../../helpers').seo;
const $config = require('../../config');
const express = require('express');
const $path = require('path');
const Handlebars = require('handlebars');
const $fsData = require('../../fsData');

let router = express.Router();

fs.readdirSync(__dirname).forEach(file => {

  //We only want .js files
  if(!file.endsWith('.js')) { return; }

  let _name = file.substr(0, file.length - 3);

  //If name is index, avoid
  if(_name == 'index') { return; }

  router.use('/' + _name, require($path.join(__dirname, file)));
});

/**
 * Index route
 */
router.get('/', async (req, res) =>  {
  try {
    let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'seo', 'index.hbs')));
    let _dates = await $fsData.server.getDates();

    let _result = _template({
      'title': $seo.index.title(),
      'description': $seo.index.description(),
      'keywords': $seo.keywords(),
      'lastUpdate': _dates[_dates.length - 1]
    });

    return res.send(_result);
  } catch(error) {
    $log.error('Error > %o', error);
    return res.status(500).end();
  }
});

/**
 * Twitch channels route
 */
router.get('/twitchChannels', async (req, res) => {
  try {

    let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'seo', 'twitchChannels.hbs')));

    let _result = _template({
      'title': $seo.twitch.title(),
      'description': $seo.twitch.description(),
      'keywords': $seo.keywords(),
    });

    
    return res.send(_result);
  } catch(error) {
    $log.error('Error -> %o', error);
    return res.status(500).end();
  }
});


router.use('/', express.static('www'));

module.exports = router;

