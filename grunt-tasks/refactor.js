module.exports = (function() {

  let grunt = require('grunt');
  let $refactor = require('../node_refactor');

  /**
   * Refactor task
   */
  grunt.registerTask('refactor', 'refactor some data, usage: refactor:servers', function() {
    let _done = this.async();
    switch(this.args[0]) {
      case 'servers':
        $refactor.servers.setIdAndNames().then(_done);
        break;

        default:
        grunt.log.warn('usage: refactor:servers')
    }
  });

})();