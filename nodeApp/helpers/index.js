/* global require, module, __dirname */
const fs = require('fs');


module.exports = {};

fs.readdirSync(__dirname).forEach(file => {

  //Only attach js files
  if(!file.endsWith('.js')) { return; }

  //get file name
  var _name = file.substr(0, file.length - 3);

  //If name is index, avoid
  if(_name == 'index') { return; }

  //Add module
  module.exports[_name] = require(__dirname + '/' + file);
});