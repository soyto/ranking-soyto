(() => {

  const fs = require('fs');
  const $fs = require('../../helpers').fs;
  const $log = require('../../helpers').log;
  const $seo = require('../../helpers').seo;
  const $config = require('../../../config');
  const express = require('express');
  const $path = require('path');
  const Handlebars = require('handlebars');

  let router = express.Router();

  router.use('/character', require('./character'));
  router.use('/ranking', require('./ranking'));

  router.get('/', async (req, res) =>  {
    try {
      let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'scrapper', 'index.hbs')));

      let _result = _template({
        'title': $seo.index.title(),
        'description': $seo.index.description(),
        'keywords': $seo.keywords(),
      });

      return res.send(_result);
    } catch(error) {
      $log.error('Error > %o', error);
      return res.status(500);
    }
  });


  router.use('/', express.static('www'));

  module.exports = router;

})();

