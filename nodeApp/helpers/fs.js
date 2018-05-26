let $fs = require('fs');

function Fs() {}

/**
 * Read dir
 * @param {*} name 
 */
Fs.prototype.readdir = function(name) {
  return new Promise((resolve, reject) => {
    $fs.readdir(name, (error, files) => {
      if(error) { return reject(error); }
      return resolve(files); 
    });
  });
};


/**
 * Read json File
 * @param {*} name 
 */
Fs.prototype.readJSON = function(name) {
  return new Promise((resolve, reject) => {
    $fs.readFile(name, 'utf8', (error, data) => {
      if(error) { return reject(error); }
      try {
        return resolve(JSON.parse(data));
      } catch(error) {
        return reject(error);
      }
    });
  });
};

/**
 * Writes a file
 * @param {*} name 
 * @param {*} data 
 */
Fs.prototype.write = function(name, data) {
  return new Promise((resolve, reject) => {
    $fs.writeFile(name, data, error => {
      if(error) {
        return reject(error);
      }
      return resolve();
    });
  });
};

/**
 * Write JSON data
 * @param {*} name 
 * @param {*} data 
 */
Fs.prototype.writeJSON = function(name, data) {
  return this.write(name, JSON.stringify(data));
};

module.exports = new Fs();