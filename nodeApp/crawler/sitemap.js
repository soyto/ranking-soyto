let $fs = require('../helpers').fs;
let $log = require('../helpers').log;
let $config = require('../config');
let $path = require('path');


function Sitemap() {}

/**
 * Generate sitemap
 * @return {Promise}
 */
Sitemap.prototype.generate = function() {
  return new Promise(async (resolve, reject) => {
    let _sitemapFiles = [(await _generateServersSitemap())]
      .concat(await _generateCharactersSitemap());

    let _txt = '<?xml version="1.0" encoding="UTF-8"?>\n';
    _txt += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for(let $$sitemapFile of _sitemapFiles) {
      _txt += '<sitemap><loc>http://soyto.org/' + $$sitemapFile +  '</loc></sitemap>\n';
    }
    _txt += '</sitemapindex>';

    await $fs.write($path.join($config.folders.www, 'sitemap.xml'), _txt);

    resolve();
  });
};

/**
 * Generate servers sitemap
 * @return {Promise}
 * @private
 */
function _generateServersSitemap() {
  return new Promise(async (resolve, reject) => {
    let _txt = '<?xml version="1.0" encoding="UTF-8"?>\n';
    _txt += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    _txt += '<url><loc>http://soyto.org/</loc></url>\n';

    for(let $$date of (await $fs.readdir($config.folders.servers))) {
      for(let $$serverFile of (await $fs.readdir($path.join($config.folders.servers, $$date)))) {
        let _serverName = $$serverFile.split('.')[0];
        _txt += '<url><loc>http://soyto.org/#!/ranking/' +  _serverName + '/' + $$date + '</loc></url>\n';
      }
    }

    _txt += '</urlset>';
    await $fs.write($path.join($config.folders.www, 'sitemap_servers.xml'), _txt);

    resolve('sitemap_servers.xml');
  });
}

/**
 * Generate characters sitemap
 * @private
 */
function _generateCharactersSitemap() {
  return new Promise(async (resolve, reject) => {
    let _files = [];

    for(let $$serverFolder of (await $fs.readdir($config.folders.characters))) {
      let _fileName = 'sitemap_' + $$serverFolder + '_characters.xml';

      let _txt = '<?xml version="1.0" encoding="UTF-8"?>\n';
      _txt += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      for(let $$characterFile of (await $fs.readdir($path.join($config.folders.characters, $$serverFolder)))) {
        let _characterId = $$characterFile.split('.')[0];

        _txt += '<url><loc>http://soyto.org/#!/character/' +  $$serverFolder + '/' + _characterId + '</loc></url>\n';
      }

      _txt += '</urlset>';
      await $fs.write($path.join($config.folders.www, _fileName), _txt);
      _files.push(_fileName);
    }

    resolve(_files);
  });
}


module.exports = new Sitemap();