var $config =  module.exports = {

  'crawler': {
    'user-agent': 'soyto.github.io crawler',
  },

  'application': {
    'servers-folder': 'data/Servers/',

    'base-folder': 'data/',
    'posts-folder': '_posts/',
    'app-folder': 'app/',
    'app-files': [
      'app/assets/app/app.js',
      'app/assets/app/controllers/characterInfo.controller.js',
      'app/assets/app/controllers/index.controller.js',
      'app/assets/app/controllers/ranking.list.controller.js',
      'app/assets/app/controllers/ranking.list.mobile.controller.js',
      'app/assets/app/controllers/merge.list.controller.js',
      'app/assets/app/controllers/merge.mobile.list.controller.js',
      'app/assets/app/controllers/root.controller.js',
      'app/assets/app/controllers/twitchChannels.controller.js',
      'app/assets/app/directives/facebookCommentBox.directive.js',
      'app/assets/app/directives/facebookLike.directive.js',
      'app/assets/app/directives/ngScrollTo.directive.js',
      'app/assets/app/directives/twitchPanel.directive.js',
      'app/assets/app/directives/youtubePanel.directive.js',
      'app/assets/app/services/blog.service.js',
      'app/assets/app/services/characterSocial.service.js',
      'app/assets/app/services/console.service.js',
      'app/assets/app/services/helper.service.js',
      'app/assets/app/services/storedData.service.js',
      'app/assets/app/services/twitch.service.js',
      'app/assets/app/services/youtube.service.js',
      'app/assets/app/services/helperService/$q.service.js'
    ],
    'node-app-files': [
      'nodeApp/application.tasks.js',
      'nodeApp/blog.js',
      'nodeApp/blog.tasks.js',
      'nodeApp/gameforge.server.js',
      'nodeApp/gameforge.server.tasks.js',
    ],
    'concat-dest': 'app/assets/dist/app.js',
    'uglify-dest': 'app/assets/dist/app.min.js'
  }
};

//NodeApp config
$config.nodeApp = {
  'debug_mode': true
};


$config.folders = {
  'servers': 'data/Servers/',
  'characters': 'data/Characters/',
  'appData': 'data/app/',
};

$config.files = {
  'foldersDates': $config.folders.appData + 'dates.js'
};

