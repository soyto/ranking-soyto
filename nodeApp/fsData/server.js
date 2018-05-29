let $fs = require('../helpers').fs;
let $log = require('../helpers').log;
let $config = require('../config');

function Server() {}

/**
 * Get stored dates
 */
Server.prototype.getDates = function() {
  return new Promise(async (resolve, reject) => {

    try {
      //Read from disk
      let _dates = await $fs.readdir($config.folders.servers);
      _dates.sort((a, b) => (new Date(a).getTime() - (new Date(b).getTime())));
      return resolve(_dates);

    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Gets server by name and date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.get = function(date, serverName) {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve($fs.readJSON($config.folders.servers + '/' + date + '/' + serverName + '.json'));
    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Gets last date from an specified server
 * @param {*} serverName 
 */
Server.prototype.getLast = function(serverName) {
  return new Promise(async (resolve, reject) => {
    try {
      let _dates = await this.getDates();
      let _lastDate = _dates[_dates.length - 1];
      return resolve(this.get(_lastDate, serverName));
    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Stores server data
 * @param {*} date 
 * @param {*} serverName 
 * @param {*} data 
 */
Server.prototype.store = function(date, serverName, data) {
  return new Promise(async (resolve, reject) => {
    try {
      //Invalidate cache and store it
      return resolve($fs.writeJSON($config.folders.servers + '/' + date + '/' + serverName + '.json', data));
    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Updates server previous date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.updateServerPreviousDate = function(serverData) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _idx = _dates.indexOf(serverData.date);

    //If we are trying to update first or non existent...
    if(_idx <= 0) { return resolve();}

    let _oldDate = _dates[_idx - 1];

    if(!serverData.dates) { serverData.dates = {}; }

    serverData.dates.previous = _oldDate;

    resolve();
  });
};

/**
 * Updates server next date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.updateServerNextDate = function(serverData) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _idx = _dates.indexOf(serverData.date);

    //If we are trying to update first or non existent...
    if(_idx < 0 || _idx == _dates.length - 1) { return resolve(); }

    let _nextDate = _dates[_idx + 1];

    if(!serverData.dates) { serverData.dates = {}; }

    serverData.dates.next = _nextDate;

    resolve();
  });
};

module.exports = new Server();