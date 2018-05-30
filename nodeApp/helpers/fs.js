let $fs = require('fs');
let $path = require('path');

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
 * @param {*} prettyPrint
 */
Fs.prototype.writeJSON = function(name, data, prettyPrint) {
  return prettyPrint ? this.write(name, JSON.stringify(data, null, ' ')) : this.write(name, JSON.stringify(data));
};

/**
 * Gets lsTats
 * @param {*} path
 */
Fs.prototype.lstat = function(path) {
  return new Promise((resolve, reject) => {
    $fs.lstat(path, (error, stats) => {
      if(error) {
        return reject(error);
      }
      return resolve(stats);
    });
  });
};

/**
 * Removes a file
 * @param {*} path
 */
Fs.prototype.unlink = function(path) {
  return new Promise((resolve, reject) => {
    $fs.unlink(path, (error) => {
      if(error) { return reject(error); }
      else { return resolve(); }
    });
  });
};

/**
 * Removes a directory
 * @param {*} path
 * @param {*} force
 */
Fs.prototype.rmdir = function(path, force) {

  if(!force) {
    return new Promise((resolve, reject) => {
      $fs.rmdir(path, (error) => {
        if(error) { return reject(error); }
        else { return resolve(); }
      });
    });
  }
  else {
    return new Promise(async (resolve, reject) => {
      try {
        let _filesAndFolders = await this.readdir(path);

        for (let $$file of _filesAndFolders) {
          let _path = $path.join(path, $$file);
          let _stats = await this.lstat(_path);

          if (_stats.isDirectory()) {
            await this.rmdir(_path, true);
          }
          else {
            await this.unlink(_path);
          }
        }

        return resolve(await this.rmdir(path));
      } catch(error) {
        return reject(error);
      }

    });
  }

};

module.exports = new Fs();