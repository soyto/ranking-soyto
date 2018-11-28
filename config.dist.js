(() => {

  const $path = require('path');
  const grunt = require('grunt');

  let $config = {};

  /*
   * SERVER CONFIGURATION
   * -------------------------------------------------------------------
   */

  $config.server = {};
  $config.cache = {};
  $config.authorization = {};
  $config.fsData = {};

  /**
   * Is server in debug mode?
   * @type {boolean}
   */
  $config.server.debug_mode = true;

  /**
   * Server port
   */
  $config.server.port = 8080;

  /**
   * Cache configuration
   */
  $config.cache.stdTTL = 5;

  /**
   * Your Secret goes here
   * @type {string}
   */
  $config.authorization.secret = 'YOUR_SECRET_HERE';

  /**
   * fileSystem configuration
   */
  $config.fsData.prettyPrint = false;

  /*
   * SERVER security
   * -------------------------------------------------------------------
   */

  $config.server.security = {};

  /**
   * bCrypt num of rounds
   * @type {number}
   */
  $config.server.security.bcryptSaltRounds = 10;

  /*
   * ADMIN USER
   * -------------------------------------------------------------------
   */

  $config.server.admin = {};

  $config.server.admin.uuid = '31ab09d0-f30c-11e8-9823-75e78e909b3d';
  $config.server.admin.username = 'admin';
  $config.server.admin.password = '1234';
  $config.server.admin.email = 'YOUR_EMAIL_GOES_HERE';


  /*
   * CRAWLER CONFIGURATION
   * -------------------------------------------------------------------
   */

  /**
   * Crawler configuration
   */
  $config.crawler = {
    'userAgent': 'soyto.github.io crawler',
    'timeout': 5000,
    'url': {
      'login': 'https://en.aion.gameforge.com/website',
      'serverPage': 'https://en.aion.gameforge.com/website/resources/pubajax/ranking/honorpoints/paging/{page}/',
    }
  };


  /*
   * SERVER FOLDERS
   * -------------------------------------------------------------------
   */

  $config.folders = {};

  //
  // --------- MAIN FOLDERS
  //

  $config.folders.data = 'data/';
  $config.folders.gruntTasks = 'grunt-tasks';
  $config.folders.nodeApp = 'nodeApp/';
  $config.folders.www = 'www/';
  $config.folders.database = 'db/';
  $config.folders.dbScripts = 'db_scripts/';

  $config.folders.servers = $path.join($config.folders.data, 'Servers');
  $config.folders.characters = $path.join($config.folders.data, 'Characters');
  $config.folders.appData = $path.join($config.folders.data, 'app');
  $config.folders.posts = $path.join($config.folders.data, 'Posts');
  $config.folders.templates = $path.join($config.folders.nodeApp, 'templates');

  $config.folders.app_assets = $path.join($config.folders.www, 'assets');
  $config.folders.app_dist = $path.join($config.folders.app_assets, 'dist');
  $config.folders.app_sass = $path.join($config.folders.app_assets, 'scss');

  /*
   * SERVER FILES
   * -------------------------------------------------------------------
   */

  $config.files = {};


  $config.files.foldersDates = $path.join($config.folders.appData, 'dates.js');
  $config.files.characterPics = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data', 'characterPics.json');
  $config.files.characterSocial = $path.join($config.folders.www, 'assets', 'app', '_deprecated_data', 'characterSocial.json');

  //Database
  $config.files.database = $path.join($config.folders.database, 'db.db');

  $config.files.concat_dest = $path.join($config.folders.www, 'assets', 'dist', 'app.js');
  $config.files.uglify_dest = $path.join($config.folders.www, 'assets', 'dist', 'app.min.js');
  $config.files.app_css_dist = $path.join($config.folders.app_dist, 'site.css');

  /**
   * Application files
   * @type {void|*}
   */
  $config.files.app_files = grunt.file.expand($path.join($config.folders.www, 'assets', 'app', '**/**.js'));

  /**
   * Node App files
   * @type {void|*}
   */
  $config.files.nodeApp_files = grunt.file.expand($path.join($config.folders.nodeApp, '**/**.js'));

  /**
   * Grunt tasks files
   * @type {void|*}
   */
  $config.files.gruntTasks_files = grunt.file.expand($path.join($config.folders.gruntTasks, '**/**.js'));

  module.exports = $config;
})();
