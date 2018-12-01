(() => {

  const $log = require('../helpers').log;
  const $fs = require('../helpers').fs;
  const Handlebars = require('handlebars');
  const $path = require('path');
  const $config = require('../../config');
  const $minify = require('html-minifier').minify;

  /**
   * Handlebars service main class
   */
  class HandlebarsService {
    constructor() {
      this.www = new _WWW();
    }
  }

  /**
   * WWW Class
   */
  class _WWW {
    constructor() {

    }

    async renderIndex() {
      let _templateInputLocation = $path.join($config.folders.templates, 'www', 'index.hbs');
      let _templateOutputLocation = $path.join($config.folders.www, 'index.html');

      let _data = {
        'app_scripts': null
      };

      if($config.server.debug_mode) {
        _data.app_scripts = $config.files.app_files.map(_mapFile);
      }
      else {
        _data.app_scripts = [$config.files.uglify_dest].map(_mapFile);
      }

      return await _render(_templateInputLocation, _templateOutputLocation, _data);
    }
  }

  /**
   * Maps file route
   * @param file
   * @returns {*}
   * @private
   */
  function _mapFile(file) {
    return file.replace('www', '').replace(/\\/g, '/');
  }


  /**
   * Renders a file from a location to a destination with given data
   * @param inputLocation
   * @param outputLocation
   * @param data
   * @return {Promise.<void>}
   * @private
   */
  async function _render(inputLocation, outputLocation, data) {

    let _input = await $fs.read(inputLocation);
    let _hsTemplate = Handlebars.compile(_input);
    let _hsResult = _hsTemplate(data);

    //Minify html if we are on production mode
    if(!$config.server.debug_mode) {
      _hsResult = $minify(_hsResult, {
        'collapseWhitespace': true
      });
    }

    await $fs.write(outputLocation, _hsResult);
  }


  module.exports = new HandlebarsService();
})();