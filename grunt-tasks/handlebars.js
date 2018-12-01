module.exports = function() {

  const grunt = require('grunt');
  const hbsService = require('../nodeApp/services').handlebars;


  grunt.registerTask('hbs-app', 'Uses hanbdlebars to generate app files', async function() {
    let done = this.async();

    try {
      await hbsService.www.renderIndex();
      grunt.log.ok('index.html generated');
    } catch(error) {
      console.error(error);
    }
    done();
  });
}();