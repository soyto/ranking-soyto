module.exports = new (function() {
  var $this = this;

  var $config = require('../config');
  var grunt = require('grunt');


  //Generate date files
  $this.generate = function() {

    var _folderDates = grunt.file.expand($config.folders.servers + '*').filter(function(folderName) {
      return folderName.split('-').length == 3;
    }).map(function(folderName){
      return folderName.split('/')[2];
    });

    //Sort folders dates
    _folderDates.sort(function(a, b){
      return (new Date(a)).getTime() - (new Date(b)).getTime();
    });

    var _txt = 'window.storedDates = ' + JSON.stringify(_folderDates).replace(/"/g, '\'') + ';';

    grunt.file.write($config.files.foldersDates, _txt);
  };


})();