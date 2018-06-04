const $fs = require('../../helpers').fs;
const $path = require('path');
const $config = require('../../config');
const $fsData = require('../../fsData');
const $log = require('../../helpers').log;
const express = require('express');
const Handlebars = require('handlebars');

let router = express.Router();


/**
 * Print handlebars template
 */
router.get('/:serverName/:characterId', async (req, res) => {
  let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'seo', 'characterInfo.hbs')));
  let _characterData = await $fsData.character.get(req.params.serverName, req.params.characterId);

  let _result = _template({'character': _characterData});

  res.send(_result);
});


module.exports = router;