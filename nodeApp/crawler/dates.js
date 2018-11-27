const $config = require('../../config');
let $fs = require('../helpers').fs;
let $log = require('../helpers').log;

/**
 * Constructor
 */
function Dates() {}

/**
 * Generate method
 */
Dates.prototype.generate = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let files = await $fs.readdir($config.folders.servers);

      //Sort files
      files.sort((a, b) => (new Date(a).getTime() - (new Date(b).getTime())));

      var _txt = 'window.storedDates = ' + JSON.stringify(files).replace(/"/g, '\'') + ';'

      await $fs.write($config.files.foldersDates, _txt);
      
      resolve();
    } catch(error) {
      reject(error);
    }
  });
};


module.exports = new Dates();