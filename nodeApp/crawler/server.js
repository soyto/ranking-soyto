let colors = require('colors');
let $gameforge = require('../gameForge');
let $log = require('../helpers').log;
let request = require('request');
let moment = require('moment');
const $config = require('../../config');

function Server() {}

/**
 * Performs a login and retrieves generated cookie
 */
Server.prototype.login = function() {

  let _requestData = {
    'method': 'GET',
    'uri': $config.crawler.url.login,
    'timeout': $config.crawler.timeout,
    'headers': {
      'user-agent': $config.crawler.userAgent
    }
  };

  return new Promise((resolve, reject) => {
    $log.debug('Performing login');
    try {
      request(_requestData, (error, response, body) => {

        if(error) {
          return reject(error);
        }

        if(response.headers['set-cookie']) {
          let _cookie = response.headers['set-cookie'][0].split(';')[0];
          $log.debug('Retrieved cookie -> %s', colors.cyan(_cookie));
          resolve(_cookie);
        }
        else {
          return reject('Couldn\'t login');
        }

      });
    } catch(error) {
      reject(error);
    }
  });
};

/**
 * Retrieves whole server Data
 * @param {*} serverId 
 * @param {*} cookie 
 */
Server.prototype.retrieveServer =  async function(serverId, cookie) {
  let _serverName = $gameforge.servers.filter(x => x.id == serverId).shift().name;

  let _resultData = {
    'serverId': serverId,
    'serverName': _serverName,
    'date': moment().format('MM-DD-YYYY'),
    'elyos': [],
    'asmodians': [],
    'errors': [],
  };

  return new Promise(async (resolve, reject) => {
    let _elyosData = await _retrieveRace(0);
    let _asmodiansData = await _retrieveRace(1);

    _resultData.elyos = _elyosData.entries;
    _resultData.asmodians = _asmodiansData.entries;
    _resultData.errors = [].concat(_elyosData.errors.map(x => x.page), _asmodiansData.errors.map(x => x.page));

    resolve(_resultData);
  });

  //Helps to retrieve whole race
  function _retrieveRace(raceId) {
    let _page = 0;
    let _continue = true;
    let _entries = [];
    let _errors = [];
    let _race_str = raceId == 0 ? colors.green('Elyos') : colors.magenta('Asmodians');

    return new Promise(async (resolve, reject) => {

      do {
        try {
          let _currentEntries = await _retrievePage(serverId, raceId, _page, cookie);

          //Append entries
          _entries = _entries.concat(_currentEntries.entries);

          $log.debug('[%s:%s-%s] >>>> Downloaded %s characters', 
            colors.cyan(_serverName), 
            colors.yellow(_page + 1),
            _race_str,
            colors.green(_currentEntries.entries.length));

          if(!_currentEntries.hasMoreElementsToDown || _page > 20) {
            _continue = false;
          }
          else {
            _page++;
          }
        }
        catch(error) {

          if(error.code == 'TIMEOUT') {
            $log.debug('[%s:%s-%s] ---- %s', 
              colors.cyan(_serverName), 
              colors.yellow(_page + 1),
              _race_str,
              colors.yellow('TIMEOUT'));
          }
          else {

            if(['BADFORMAT', 'BODY_BADFORMATTED'].indexOf(error.code) >= 0) {
              $log.debug('[%s:%s-%s] ---- %s', 
                colors.cyan(_serverName), 
                colors.yellow(_page + 1),
                _race_str,
                colors.red('BAD FORMAT'));
            }
            else if(error.code == 'SERVER_FAULT') {
              $log.debug('[%s:%s-%s] ---- %s', 
                colors.cyan(_serverName), 
                colors.yellow(_page + 1),
                _race_str,
                colors.red('SERVER FAULT'));
            }
            else {
              $log.debug('[%s:%s-%s] ---- %s', 
                colors.cyan(_serverName), 
                colors.yellow(_page + 1),
                _race_str,
                colors.red('UNKNOWN ERROR'));
            }

            _errors.push({
              'page': _page,
              'error': error
            });

            _page++;

          }

        }
      } while(_continue);

      resolve({
        'entries': _entries,
        'errors': _errors
      });
    });
  }
};

/**
 * Retrieves a page from Server
 * @param {*} serverId 
 * @param {*} raceId 
 * @param {*} cookie 
 * @param {*} page 
 */
function _retrievePage(serverId, raceId, page, cookie) {

  let _postData = {
    'characterClassID':  ['1', '2',  '4', '5', '7', '8', '10', '11' , '13', '14' , '16'],
    'raceID': [raceId],
    'serverID': [serverId],
    'soldierRankID': null,
    'sortBy': 'POSITION',
    'order': 'ASC'
  };

  let _requestData = {
    'method': 'POST',
    'url': $config.crawler.url.serverPage.replace(/\{page\}/, page),
    'timeout': $config.crawler.timeout,
    'headers': {
      'user-agent': $config.crawler.userAgent,
      'Cookie': cookie,
      'X-Requested-With': 'XMLHttpRequest'
    },
    'json': _postData
  };

  return new Promise((resolve, reject) => {
    try {
      request(_requestData, (error, response, body) => {

        //Check if there is an error
        if(error) {
          if(['ESOCKETTIMEDOUT', 'ETIMEDOUT'].indexOf(error.code) >= 0) {
            return reject({
              'code': 'TIMEOUT',
              'error': error
            });
          }
          else if(error.code == 'BADFORMAT') {
            return reject({
              'code': 'BADFORMAT',
              'error': error
            });
          }
          else {
            return reject({
              'code': 'UNKNOWN',
              'error': error
            });
          }
        }

        //If server throwns a 500 statusCode
        if(response.statusCode === 500) {
          return reject({
            'code': 'SERVER_FAULT'
          });
        }

        //If body isn't an object
        if(typeof body != 'object') {
          return reject({
            'code': 'BODY_BADFORMATTED'
          });
        }

        return resolve(body);
      });
    } catch(error) {
      reject({
        'code': 'UNKNOWN',
        'error': error
      });
    }
  });
};


module.exports = new Server();
