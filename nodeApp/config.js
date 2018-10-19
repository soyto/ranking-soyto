var $path = require('path');

var $config  = {
  'application': {
    'servers-folder': 'data/Servers/',

    'base-folder': 'data/',
    'posts-folder': '_posts/',
    'app-folder': 'app/',
    'app-files': [
      'www/assets/app/app.js',
      'www/assets/app/controllers/characterInfo.controller.js',
      'www/assets/app/controllers/index.controller.js',
      'www/assets/app/controllers/ranking.list.controller.js',
      'www/assets/app/controllers/ranking.list.mobile.controller.js',
      'www/assets/app/controllers/merge.list.controller.js',
      'www/assets/app/controllers/merge.mobile.list.controller.js',
      'www/assets/app/controllers/root.controller.js',
      'www/assets/app/controllers/twitchChannels.controller.js',
      'www/assets/app/directives/animationend.directive.js',
      'www/assets/app/directives/enchantSimulator.directive.js',
      'www/assets/app/directives/facebookCommentBox.directive.js',
      'www/assets/app/directives/facebookLike.directive.js',
      'www/assets/app/directives/ngScrollTo.directive.js',
      'www/assets/app/directives/twitchPanel.directive.js',
      'www/assets/app/directives/youtubePanel.directive.js',
      'www/assets/app/services/characterSocial.service.js',
      'www/assets/app/services/console.service.js',
      'www/assets/app/services/enchant.service.js',
      'www/assets/app/services/helper.service.js',
      'www/assets/app/services/storedData.service.js',
      'www/assets/app/services/twitch.service.js',
      'www/assets/app/services/youtube.service.js',
      'www/assets/app/services/helperService/$q.service.js'
    ],
    'concat-dest': 'www/assets/dist/app.js',
    'uglify-dest': 'www/assets/dist/app.min.js'
  }
};

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
  'foldersDates': $path.join($config.folders.appData ,'dates.js'),
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
