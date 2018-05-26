let $fs = require('../helpers').fs;
let $log = require('../helpers').log;
let $cache = require('../helpers').cache;
let $config = require('../config');

const CACHE_KEY = 'fsData.cache.';

function Server() {}

/**
 * Get stored dates
 */
Server.prototype.getDates = function() {
  return new Promise(async (resolve, reject) => {
    let _dates = await $cache.get(CACHE_KEY + 'dates');

    //Attempt to retrieve from cache
    if(_dates) {
      return resolve(_dates);
    }

    //Read from disk
    _dates = await $fs.readdir($config.folders.servers);
    _dates.sort((a, b) => (new Date(a).getTime() - (new Date(b).getTime())));

    //Store on cache
    await $cache.set(CACHE_KEY + 'dates', _dates);

    return resolve(_dates);
  });
};

/**
 * Gets server by name and date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.get = function(date, serverName) {
  const _cacheKey = CACHE_KEY + date + '.' + serverName;

  return new Promise(async (resolve, reject) => {
    try {
      let _serverData = await $cache.get(_cacheKey);

      //Attempt to retrieve from cache
      if(_serverData) {
        return resolve(_serverData);
      }

      //Read from disk
      _serverData = await $fs.readJSON($config.folders.servers + '/' + date + '/' + serverName + '.json'); 

      //Store on cache
      await $cache.set(_cacheKey, _serverData);
      resolve(_serverData);
    } catch(error) {
      reject(error);
    }
  });
};

/**
 * Gets last date from an specified server
 * @param {*} serverName 
 */
Server.prototype.getLast = function(serverName) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _lastDate = _dates[_dates.length - 1];
    resolve(this.get(_lastDate, serverName));
  });
};

/**
 * Stores server data
 * @param {*} date 
 * @param {*} serverName 
 * @param {*} data 
 */
Server.prototype.store = function(date, serverName, data) {
  const _cacheKey = CACHE_KEY + date + '.' + serverName;

  return new Promise(async (resolve, reject) => {

    //Invalidate cache and store it
    await $cache.del(_cacheKey);
    await $cache.set(_cacheKey, data);
    resolve($fs.writeJSON($config.folders.servers + '/' + date + '/' + serverName + '.json', data));
  });
};

/**
 * Updates server previous date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.updateServerPreviousDate = function(date, serverName) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _idx = _dates.indexOf(date);

    //If we are trying to update first or non existent...
    if(_idx <= 0) {
      return resolve();
    }

    let _oldDate = _dates[_idx - 1];
    let _serverData = await this.get(date, serverName);

    if(!_serverData.dates) {
      _serverData.dates = {};
    }

    _serverData.dates.previous = _oldDate;
    resolve(this.store(date, serverName, _serverData));
  });
};

/**
 * Updates server next date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.updateServerNextDate = function(date, serverName) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _idx = _dates.indexOf(date);

    //If we are trying to update first or non existent...
    if(_idx < 0 || _idx == _dates.length - 1) {
      return resolve();
    }

    let _nextDate = _dates[_idx + 1];
    let _serverData = await this.get(date, serverName);

    if(!_serverData.dates) {
      _serverData.dates = {};
    }

    _serverData.dates.next = _nextDate;
    resolve(this.store(date, serverName, _serverData));
  });
};


module.exports = new Server();