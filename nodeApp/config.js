(() => {

  const $path = require('path');
  const grunt = require('grunt');

  let $config = {};

  $config.application = {
    'servers-folder': 'data/Servers/',

    'base-folder': 'data/',
    'posts-folder': '_posts/',
    'app-folder': 'app/',
  };

  /**
   * Concat destination
   * @type {string}
   */
  $config.application.concat_dest = 'www/assets/dist/app.js';
  /**
   * Uglify destination
   * @type {string}
   */
  $config.application.uglify_dest = 'www/assets/dist/app.min.js';

  /**
   * Application files
   * @type {void|*}
   */
  $config.application.app_files = grunt.file.expand('www/assets/app/**/**.js');


  //Cache configuration
  $config.cache = {
    'stdTTL': 5
  };

  //Crawler configuration
  $config.crawler = {
    'userAgent': 'soyto.github.io crawler',
    'timeout': 5000,
    'url': {
      'login': 'https://en.aion.gameforge.com/website',
      'serverPage': 'https://en.aion.gameforge.com/website/resources/pubajax/ranking/honorpoints/paging/{page}/',
    }
  };

  /**
   * fileSystem configuration
   */
  $config.fsData = {
    'prettyPrint': false
  };

  //NodeApp config
  $config.nodeApp = {
    'debug_mode': true
  };

  //Folders configuration
  $config.folders = {
    'servers': 'data/Servers/',
    'characters': 'data/Characters/',
    'appData': 'data/app/',
    'www': 'www/',
    'templates': 'nodeApp/templates',
  };

  //Files configuration
  $config.files = {
    'foldersDates': $path.join($config.folders.appData, 'dates.js'),
    'characterPics': $path.join($config.folders.www, 'assets', 'app', '_deprecated_data', 'characterPics.json'),
    'characterSocial': $path.join($config.folders.www, 'assets', 'app', '_deprecated_data', 'characterSocial.json'),
  };

  /**
   * Server configuration
   */
  $config.server = {
    'port': 8080
  };


  module.exports = $config;

})();
