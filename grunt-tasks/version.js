/* global require, module */
module.exports = function() {

  var sh = require('shelljs');
  var grunt = require('grunt');
  var semver = require('semver');

  //Sets the version if no arguments adds a suffix
  grunt.registerTask('version', 'changes version, usage: version:minor, version:patch, etc', function(){
    _setVersion(this.args[0], this.args[1]);
  });

  //Sets the version
  grunt.registerTask('set-version', 'sets the version, ussage: set-version --newVersion=xx.xx.xx', function () {
    var _version = grunt.option('newVersion');

    if(!_version) { grunt.fatal('You must set up a new version with the format set-version --newVersion=xx.xx.xx'); }

    _updateVersion(_version);
  });

  //Adds all contents of data folder to git
  grunt.registerTask('git-add-data', function(){
    var result = sh.exec('git add data -v');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Performs commit
  grunt.registerTask('git-commit', function(){

    var msg = grunt.option('message');

    if(!msg) { //Try to retrieve git commit message from config
      msg = grunt.config('git.commit.message');
    }

    var cmd ='';

    if(msg) {
      cmd = 'git commit -a -m "(' + msg + ') (' + grunt.config('pkg.version') + ')"';
    } else {
      cmd = 'git commit -a -m "Canges for version: ' + grunt.config('pkg.version') + '"';
    }

    var result = sh.exec(cmd, {silent:true});

    if(result.code !== 0) {
      grunt.fatal(result.output);
    }
  });

  //Performs push
  grunt.registerTask('git-push', function(){
    var result = sh.exec('git push');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Performs pull
  grunt.registerTask('git-pull', 'pulls from remote repository', () => {
    var result = sh.exec('git pull');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Publish the application without increase nothing
  grunt.registerTask('publish', function() {

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'git-commit', 'git-push']);
  });

  //Publish the application as patch
  grunt.registerTask('publish-patch', function(){

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'version:patch', 'git-commit', 'git-push']);
  });

  //Publish the application as minor
  grunt.registerTask('publish-minor', function(){

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'version:minor', 'git-commit', 'git-push']);
  });



  /* HELPER FUNCTIONS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Sets the version:
  // type: major, minor, patch
  // suffix: whatever suffix u want
  function _setVersion(type, suffix) {
    var file = 'package.json';
    var gruntFile = grunt.file.readJSON(file);


    if(type) {
      gruntFile.version = semver.inc(gruntFile.version, type);
    }

    if(suffix) {
      gruntFile.version += '-' + suffix;
    }

    _updateVersion(gruntFile.version);
  }

  //Updates version
  function _updateVersion(newVersion) {
    var _file = 'package.json';
    var _packageLockFile = 'package-lock.json';

    var _gruntFile = grunt.file.readJSON(_file);
    var _gruntFileLock = grunt.file.readJSON(_packageLockFile);

    _gruntFile.version = newVersion;
    _gruntFileLock.version = newVersion;

    grunt.config('pkg.version', newVersion);


    grunt.file.write(_file, JSON.stringify(_gruntFile, null, '  '));
    grunt.file.write(_packageLockFile, JSON.stringify(_gruntFileLock, null, '  '));

    grunt.log.ok('Version set to ' + newVersion.cyan);
  }

}();