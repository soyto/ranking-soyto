/* global require */
module.exports = function(grunt) {
  'use strict';

  require('../app/assets/lib/javascript.extensions');
  var moment = require('moment');
  var colors = require('colors');
  var marked = require('marked');
  var blog   = require('../nodeApp/blog');


  grunt.registerTask('generate-blog-files', function(){
    blog.generateBlogFiles();
  });
};