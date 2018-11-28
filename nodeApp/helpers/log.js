let colors = require('colors');
let $config = require('../../config');

function Log() {};

Log.prototype.debug = function(msg) {

  if(!$config.nodeApp.debug_mode) { return; }

  var msg = arguments[0];
  var args =  [];
  if(arguments.length > 1) {
    for(var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
  }

  console.log.apply(console.log, ['>>'.green + ' ' + msg].concat(args));
};

Log.prototype.error = function(msg) {
  var msg = arguments[0];
  var args =  [];
  if(arguments.length > 1) {
    for(var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
  }

  console.log.apply(console.error, ['>>'.red + ' ' + msg].concat(args));
};

Log.prototype.warn = function(msg) {
  var msg = arguments[0];
  var args =  [];
  if(arguments.length > 1) {
    for(var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
  }

  console.warn.apply(console.log, ['>>'.yellow + ' ' + msg].concat(args));
};

module.exports = new Log();