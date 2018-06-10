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
router.get(['/:serverName/', '/:serverName/:date/'], async (req, res) => {
  try {

    let _serverData = req.params.date ? await $fsData.server.get(req.params.date, req.params.serverName) : await $fsData.server.getLast(req.params.serverName);

    if(!_serverData) {
      return res.status(404).end();
    }

    let _template = Handlebars.compile(await $fs.read($path.join($config.folders.templates, 'scrapper', 'serverInfo.hbs')));

    let _result = _template({
      'server': _serverData
    });

    return res.send(_result);
  } catch(error) {
    $log.error('Error > %o', error);
    return res.status(500).end();
  }
});

module.exports = router;