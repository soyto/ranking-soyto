(() => {

  const $log = require('../helpers').log;
  const $fs = require('../helpers').fs;
  const Handlebars = require('handlebars');
  const $path = require('path');
  const $config = require('../../config');

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
      let _templateOutputLocation = $path.join($config.folders.www, 'index_copy.html');

      return await _render(_templateInputLocation, _templateOutputLocation);
    }
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

    await $fs.write(outputLocation, _hsResult);
  }


  module.exports = new HandlebarsService();
})();