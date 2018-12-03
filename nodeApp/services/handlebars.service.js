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

    /**
     * Renders Index
     * @return {Promise.<void>}
     */
    async renderIndex() {
      let _templateInputLocation = $path.join($config.folders.templates, 'www', 'index.hbs');
      let _templateOutputLocation = $path.join($config.folders.www, 'index.html');

      let _data = {
        'app_scripts': null
      };

      if($config.server.debug_mode) {
        _data.app_scripts = $config.files.app_files.map(_mapScript);
      }
      else {
        _data.app_scripts = [$config.files.uglify_dest].map(_mapScript);
      }

      return await _render(_templateInputLocation, _templateOutputLocation, _data);
    }


    async renderAll() {


      for(let file of $config.files.nodeApp_hbs_files) {

        //Main index file has some special needs
        if(file == $path.join($config.folders.templates, 'www', 'index.hbs')) {
          $log.debug('Rendering [%s]', $path.join($config.folders.www, 'index.html'));
          await this.renderIndex();
        }
        else {

          let _inputFilePath = file.split('/');
          let _inputFileName = _inputFilePath.splice(_inputFilePath.length -1)[0];
          _inputFilePath = _inputFilePath.join('/');

          let _outputFilePath = _inputFilePath;
          let _outputFileName = _inputFileName;

          _outputFilePath = _outputFilePath.replace(
            $path.join($config.folders.templates, 'www', 'templates'),
            $path.join($config.folders.www, 'assets', 'app', 'templates')
          );

          //Create output file path if not exists
          if(!(await $fs.exists(_outputFilePath))) {
            await $fs.mkdir(_outputFilePath);
          }

          //Change hbs extension with html
          _outputFileName = _outputFileName.replace(/\.hbs$/, '.html');

          let _destinationFile = $path.join(_outputFilePath, _outputFileName);

          $log.debug('Rendering [%s]', _destinationFile);
          await _render(file, _destinationFile, {});
        }
      }
    }
  }

  /**
   * Maps file route
   * @param file
   * @returns {*}
   * @private
   */
  function _mapScript(file) {
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