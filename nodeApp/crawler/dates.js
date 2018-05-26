const $config = require('../config');
let $fs = require('fs');
let $log = require('../helpers').log;

/**
 * Constructor
 */
function Dates() {}

/**
 * Generate method
 */
Dates.prototype.generate = function() {
  return new Promise((resolve, reject) => {

    $fs.readdir($config.folders.servers, (err, files) => {
     
      //If there is an error
      if(err) { 
        return reject(err);
      }

      //Sort files
      files.sort((a, b) => (new Date(a).getTime() - (new Date(b).getTime())));

      var _txt = 'window.storedDates = ' + JSON.stringify(files).replace(/"/g, '\'') + ';'
      
      $fs.writeFile($config.files.foldersDates, _txt, err => {

        //If there is an error
        if(err) {
          return reject(err);
        }
        
        resolve();
      });
    });
  });
};


module.exports = new Dates();