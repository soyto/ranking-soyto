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
      return resolve(await $fs.readJSON($config.folders.servers + '/' + date + '/' + serverName + '.json'));
    } catch(error) {
      if(error && error.code == 'ENOENT') { return resolve(null); }
      else { return reject(error); }
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
      return resolve(await $fs.writeJSON($config.folders.servers + '/' + date + '/' + serverName + '.json', data, $config.fsData.prettyPrint));
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
    try {
      let _dates = await this.getDates();
      let _idx = _dates.indexOf(serverData.date);

      //If we are trying to update first or non existent...
      if (_idx <= 0) {
        return resolve();
      }

      let _oldDate = _dates[_idx - 1];

      if (!serverData.dates) {
        serverData.dates = {};
      }

      serverData.dates.previous = _oldDate;

      return resolve(serverData);
    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Updates server next date
 * @param {*} date 
 * @param {*} serverName 
 */
Server.prototype.updateServerNextDate = function(serverData) {
  return new Promise(async (resolve, reject) => {
    try {
      let _dates = await this.getDates();
      let _idx = _dates.indexOf(serverData.date);

      //If we are trying to update last or non existent...
      if (_idx < 0 || _idx == _dates.length - 1) {
        return resolve();
      }

      let _nextDate = _dates[_idx + 1];

      if (!serverData.dates) {
        serverData.dates = {};
      }

      serverData.dates.next = _nextDate;

      return resolve(serverData);
    } catch(error) {
      return reject(error);
    }
  });
};

/**
 * Update server entries
 * @param serverData
 */
Server.prototype.updateServerEntries = function(serverData) {
  return new Promise(async (resolve, reject) => {
    let _dates = await this.getDates();
    let _idx = _dates.indexOf(serverData.date);

    //If we are trying to update first or non existent...
    if(_idx <= 0) { return resolve(); }

    try {
      let _oldServerData = await this.get(_dates[_idx - 1], serverData.serverName);

      _updateServerEntries(serverData.elyos, _oldServerData.elyos);
      _updateServerEntries(serverData.asmodians, _oldServerData.asmodians);
      return resolve(serverData);
    } catch(error) {
      return reject(error);
    }
  });

  //Update server entries
  function _updateServerEntries(currentCollection, oldCollection) {
    currentCollection.forEach($$serverEntry => {
      let _oldEntry = oldCollection.filter(x => x.characterID == $$serverEntry.characterID).shift();

      if(!_oldEntry) {
        $$serverEntry.gloryPointChange = null;
        $$serverEntry.rankingPositionChange = null;
        return;
      }

      //Set up gloryPointChange
      $$serverEntry.gloryPointChange = $$serverEntry.gloryPoint -  _oldEntry.gloryPoint;

      //Set up rankingPositionChange
      $$serverEntry.rankingPositionChange = _oldEntry.position - $$serverEntry.position;
    });
  }
};

/**
 * Update server stats
 * @param {*} serverData 
 */
Server.prototype.updateServerStats = function(serverData) {
  return new Promise((resolve, reject) => {
    try {
      serverData.stats = {
        'elyos': _setUpStats(serverData.elyos),
        'asmodians': _setUpStats(serverData.asmodians),
      };

      return resolve(serverData);
    } catch(error) {
      return reject(error);
    }
  
  });

  //Set up stats 
  function _setUpStats(collection) {
    let _topHP = null;
    let _topPositionChange = null;
    let _lowerPositionChange = null;

    collection.forEach($$character => {

      if($$character.gloryPointChange) {
        if(!_topHP || _topHP.gloryPointChange < $$character.gloryPointChange) {
          _topHP = {
            'characterName': $$character.characterName,
            'characterID': $$character.characterID,
            'guildName': $$character.guildName,
            'guildID': $$character.guildID,
            'gloryPointChange': $$character.gloryPointChange
          };
        }
      }

      if($$character.rankingPositionChange) {

        if(!_topPositionChange || _topPositionChange.rankingPositionChange < $$character.rankingPositionChange) {
          _topPositionChange = {
            'characterName': $$character.characterName,
            'characterID': $$character.characterID,
            'guildName': $$character.guildName,
            'guildID': $$character.guildID,
            'rankingPositionChange': $$character.rankingPositionChange
          };
        }

        if(!_lowerPositionChange || _lowerPositionChange.rankingPositionChange > $$character.rankingPositionChange) {
          _lowerPositionChange = {
            'characterName': $$character.characterName,
            'characterID': $$character.characterID,
            'guildName': $$character.guildName,
            'guildID': $$character.guildID,
            'rankingPositionChange': $$character.rankingPositionChange
          };
        }
      }
    });

    if(!_topHP && !_topPositionChange && !_lowerPositionChange) {
      return null;
    }
    else {
      return {
        'topHP': _topHP,
        'topPositionChange': _topPositionChange,
        'lowerPositionChange': _lowerPositionChange
      };
    }
  }
};

module.exports = new Server();