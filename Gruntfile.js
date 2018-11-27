/* global require, module */
module.exports = function(grunt) {

  require('./grunt-tasks/');
  require('load-grunt-tasks')(grunt);

  var colors = require('colors');
  var config = require('./nodeApp/config.js');

  var licenseTxt = grunt.file.read('LICENSE');

  var license = '/*\n * Soyto.github.io (<%= pkg.version %>)\n';
  licenseTxt.split('\n').forEach(function(line){
    license += ' * ' + line + '\n';
  });
  license += ' */\n';


  /* GRUNT CONFIG
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  var gruntConfig = {};

  //PACKAGE
  gruntConfig.pkg = grunt.file.readJSON('package.json');

  //SASS
  gruntConfig.sass = {
    'options': {
      'implementation': require('node-sass'),
      'sourceMap': true
    },
    'dist': {
      'files': {
        'www/assets/dist/site.css': 'www/assets/scss/site.scss',
      }
    }
  };

  //JSHINT
  gruntConfig.jshint = {
    options : {jshintrc: '.jshintrc', 'force': true},
    app: config.application['app_files'],
    'node-app': config.application['node-app_files']
  };

  //CONCAT
  gruntConfig.concat  = {
    options: { banner: license },
    app: {
      options: {separator: '\n\n' },
      src: config.application['app_files'],
      dest: config.application['concat_dest'],
      nonull: true
    }
  };

  //BABEL
  gruntConfig.babel = {
    'options': {'sourceMap': true, 'presets': ['@babel/preset-env']},
    'app': {
      'files': {}
    }
  };

  //Set up babel destination file
  gruntConfig.babel.app.files[config.application.concat_dest] = config.application.concat_dest;

  //UGLIFY
  gruntConfig.uglify = {
    options: { banner: license },
    app: {
      src: [config.application.concat_dest],
      dest: config.application.uglify_dest,
    }
  };

  //WATCH
  gruntConfig.watch = {
    options: {
      debounceDelay: 250,
      dateFormat: function(time) {
        grunt.log.ok('The watch finished in %s', colors.cyan(time));;
        grunt.log.ok('Waiting for more changes');
      }
    },
    app: {
      files: config.application['app_files'],
      tasks: [
        'jshint:app',
        'concat:app',
        'babel:app',
        'uglify:app'
      ]
    },
    'sass': {
      'files': ['www/assets/scss/**/*.scss'],
      'tasks': [
        'sass'
      ]
    }
  };

  grunt.initConfig(gruntConfig);


  /* GRUNT TASKS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Default task, just jshint , concat and iglify for the moment
  grunt.registerTask('default', ['compile']);

  //Compiles application
  grunt.registerTask('compile', [
    'generate-folder-dates',
    'jshint:app',
    'concat:app',
    'babel:app',
    'uglify:app',
    'sass'
  ]);

  //Pulls from remote repo and compile em all
  grunt.registerTask('pull', [
    'git-pull',
    'compile'
  ]);
};
