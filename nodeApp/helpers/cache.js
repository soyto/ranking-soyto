const $nodeCache = require('node-cache');
const $log = require('./log');
const $config = require('../config');


const _$cache = new $nodeCache({
  'stdTTL': $config.cache.stdTTL,
});

let _isDisabled = false;

function Cache() {}

/**
 * Sets an element into cache
 * @param {*} key 
 * @param {*} value 
 */
Cache.prototype.set = function(key, value) {
  return new Promise((resolve, reject) => {

    if(_isDisabled) { 
      return resolve();
    }

    _$cache.set(key, value, (err, success) => {
      if(!err && success) {
        return resolve();
      }
      return reject();
    });
  });
};

/**
 * Gets an element from cache
 * @param {*} key 
 */
Cache.prototype.get = function(key) {
  return new Promise((resolve, reject) => {

    if(_isDisabled) {
      return resolve(undefined);
    }

    _$cache.get(key, (error, value) => {
      if(error) {
        return reject();
      }
      return resolve(value);
    });
  });
};

/**
 * Removes a key
 * @param {*} key 
 */
Cache.prototype.del = function(key) {
  return new Promise((resolve, reject) => {
    _$cache.del(key, (error, value) => {
      if(error) {
        return reject();
      }
      return resolve(value);
    });
  });
};

/**
 * Get cache stats
 */
Cache.prototype.getStats = function() {
  return _$cache.getStats();
};

/**
 * Flush all cache
 */
Cache.prototype.flushAll = function() {
  return _$cache.flushAll();
};

/**
 * Disables cache
 */
Cache.prototype.disable = function() {
  _isDisabled = true;
};

/**
 * Enables cache
 */
Cache.prototype.enable = function() {
  _isDisabled = false;
};


module.exports = new Cache();