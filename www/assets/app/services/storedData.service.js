(function(ng){
  'use strict';

  var DEBUG = false;

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $timeout = $hs.$instantiate('$timeout');
    var $location = $hs.$instantiate('$location');

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];
    var _cacheCharacterCheatSheet = null;

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;

    var $this = this;


    //Wich servers
    $this.serversList = [
      {'id': 53, 'name': 'Antriksha'},      //0
      {'id': 49, 'name': 'Barus'},          //1
      {'id': 52, 'name': 'Deyla'},          //2
      {'id': 54, 'name': 'Hellion'},        //3
      {'id': 55, 'name': 'Hyperion'},       //4
      {'id': 50, 'name': 'Loki'},           //5
      {'id': 37, 'name': 'Thor'},           //6
      {'id': 40, 'name': 'Urtem'},          //7
      //{'id': 56, 'name': 'Grendal'},      //8
      //{'id': 57, 'name': 'Fregion'},      //9
      //{'id': 58, 'name': 'Padmarashka'},  //10
      //{'id': 59, 'name': 'Miren'},        //11
      {'id': 60, 'name': 'Nergal'},         //12
      {'id': 61, 'name': 'Ereshkigal'},     //13
    ];

    //Wich dates we have stored
    $this.storedDates = $hs.sortDates($window.storedDates);

    //Character soldier ranks
    $this.characterSoldierRankIds = [
      { id: 0, name: 'Soldier Rank 10'},
      { id: 1, name: 'Soldier Rank 9'},
      { id: 2, name: 'Soldier Rank 8'},
      { id: 3, name: 'Soldier Rank 7'},
      { id: 4, name: 'Soldier Rank 6'},
      { id: 5, name: 'Soldier Rank 5'},
      { id: 6, name: 'Soldier Rank 4'},
      { id: 6, name: 'Soldier Rank 3'},
      { id: 7, name: 'Soldier Rank 2'},
      { id: 9, name: 'Soldier Rank 1'},
      { id: 10, name: 'Army 1-Star Officer'},   //Pos 701->1000
      { id: 11, name: 'Army 2-Star Officer'},   //Pos 501->700
      { id: 12, name: 'Army 3-Star Officer'},   //Pos 301->500
      { id: 13, name: 'Army 4-Star Officer'},   //Pos 101->300
      { id: 14, name: 'Army 5-Star Officer'},   //Pos 31->100
      { id: 15, name: 'General'},               //Pos 11->30
      { id: 16, name: 'Great general'},         //Pos 4->10
      { id: 17, name: 'Commander'},             //Pos 2->3
      { id: 18, name: 'Governor'},              //Pos 1
    ];

    //CharacterClasses
    $this.characterClassIds = [
      {},
      { id: 1, name: 'Gladiator', icon: 'img/gladiator.jpg' },
      { id: 2, name: 'Templar', icon: 'img/templar.jpg' },
      {},
      { id: 4, name: 'Assassin', icon: 'img/assassin.jpg' },
      { id: 5, name: 'Ranger', icon: 'img/ranger.jpg' },
      {},
      { id: 7, name: 'Sorcerer', icon: 'img/sorc.jpg' },
      { id: 8, name: 'Spiritmaster' , icon: 'img/sm.jpg'},
      {},
      { id: 10, name: 'Cleric', icon: 'img/cleric.jpg' },
      { id: 11, name: 'Chanter', icon: 'img/chanter.jpg' },
      {},
      { id: 13, name: 'Aethertech', icon: 'img/gladiator.jpg' },
      { id: 14, name: 'Gunner', icon: 'img/gunner.png' },
      {},
      { id: 16, name: 'Bard', icon: 'img/barde.png' },
    ];

    //Get character rank by position
    $this.getCharacterRankByPosition = function(position) {

      if(position === 1) { return $this.characterSoldierRankIds[18]; }
      else if(position < 4) { return $this.characterSoldierRankIds[17]; }
      else if(position < 11) { return $this.characterSoldierRankIds[16]; }
      else if(position < 31) { return $this.characterSoldierRankIds[15]; }
      else if(position < 101) { return $this.characterSoldierRankIds[14]; }
      else if(position < 301) { return $this.characterSoldierRankIds[13]; }
      else if(position < 501) { return $this.characterSoldierRankIds[12]; }
      else if(position < 701) { return $this.characterSoldierRankIds[11]; }
      else if(position < 1001) { return $this.characterSoldierRankIds[10]; }
      else { return $this.characterSoldierRankIds[9]; }

    };

    //Gets wich is rank of the selected character
    $this.getCharacterRank = function(id) { return $this.characterSoldierRankIds[id]; };

    //Retrieves character classId
    $this.getCharacterClass = function(id) { return $this.characterClassIds[id]; };

    //Retrieves info from the selected server at indicated day
    $this.getFromServer = function(date, serverName) {

      //Try to retrieve cacheItem
      var _cachedItem = _cacheServerData.first(function(itm){
        return itm.serverName == serverName && itm.date == date;
      });

      //If there is some cache item
      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': '/data/Servers/' + date + '/' + serverName + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'date': date,
          'data': $data
        };

        //Store on cache
        _cacheServerData.push(_result);

        //return
        return _result;
      });
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(_getLastDate(), serverName);
    };

    //Retrieve character info
    $this.getCharacterInfo = function(serverName, characterID) {

      var _cachedItem = _cacheCharacterInfo.filter((itm) => {
        return itm.serverName == serverName && itm.characterID == characterID;
      }).shift();

      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $http({
        'url': '/data/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      }).then(response => {

        response['data']['status'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['names'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['guilds'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        return _processCharacterInfoData(serverName, response['data']).then(function($$character){
          _cacheCharacterInfo.push($$character);
          return $$character;
        });
      });
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() { return _getLastDate(); };

    //Get character cheat sheet
    $this.getCharacterCheatSheet = function() {
      return _getCharacterCheatSheet();
    };

    //Looks for a character on all servers
    $this.characterSearch = function(text) {

      var _$$textToSearch = text.trim().toLowerCase();

      return _getCharacterCheatSheet().then(function($wholeData) {

        var _result = $wholeData.where(function($$character){
          return $$character['characterName'].toLowerCase().indexOf(_$$textToSearch) >= 0;
        });

        _result.sort(function(a, b){
          var _idxA = a['characterName'].toLowerCase().indexOf(_$$textToSearch);
          var _idxB = b['characterName'].toLowerCase().indexOf(_$$textToSearch);

          if(_idxA === _idxB) {
            var _aLength = a['characterName'].length;
            var _bLength = b['characterName'].length;

            if(_aLength == _bLength) {
              return a['characterName'].toLowerCase().localeCompare(b['characterName'].toLowerCase());
            }

            return _aLength - _bLength;
          }

          return _idxA - _idxB;
        });

        return _result;
      });
    };

    //Retrieve last date
    function _getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

    //Gets character cheatSheet
    function _getCharacterCheatSheet() {

      if(_cacheCharacterCheatSheet !== null) {
        var $$q = $q.defer();
        $timeout(function(){
          $$q.resolve(_cacheCharacterCheatSheet);
        });
        return $$q.promise;
      }

      var _url = '/data/app/charactersSheet.json';
      return $q.likeNormal($http.get(_url)).then(function($wholeData){
        $wholeData.forEach(function($$entry){
          $$entry['characterClass'] = $this.getCharacterClass($$entry['characterClassID']);
          $$entry['soldierRank'] = $this.getCharacterRank($$entry['characterSoldierRankID']);
          $$entry['raceName'] = $$entry['characterRaceID'] == 1 ? 'Asmodian' : 'Elyos';
        });

        _cacheCharacterCheatSheet = $wholeData;
        return $wholeData;
      });
    }

    //Process character info data
    function _processCharacterInfoData(serverName, characterInfoData) {
      
      //Create result
      var _result = {
        'serverName': serverName,
        'characterID': characterInfoData['characterID'],
        'characterName': characterInfoData['characterName'],
        'pictureURL': '//placehold.it/450X300/DD66DD/EE77EE/?text=' + characterInfoData.characterName,
        'names': characterInfoData['names'],
        'characterClassID': characterInfoData['characterClassID'],
        'characterClass': $this.getCharacterClass(characterInfoData['characterClassID']),
        'raceID': characterInfoData['raceID'],
        'raceName': characterInfoData['raceID'] == 1 ? 'Asmodian' : 'Elyos',
        'guildID': characterInfoData['guildID'],
        'guildName': characterInfoData['guildName'],
        'guilds': characterInfoData['guilds'],
        'gloryPoint': characterInfoData['gloryPoint'],
        'gloryPointChange': characterInfoData['gloryPointChange'],
        'position': characterInfoData['position'],
        'rankingPositionChange': characterInfoData['rankingPositionChange'],
        'soldierRankID': characterInfoData['soldierRankID'],
        'soldierRank': $this.getCharacterRank(characterInfoData['soldierRankID']),
        'status': characterInfoData['status'].slice(-50),
        'social': {}
      };

      //Normalize and sort collection dates
      _normalizeCollectionDates(_result['names'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['guilds'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['status'], 'date').sort(_dateSortFn('date', 'desc'));

      //Normalize soldier ranks on each status
      _result['status'].forEach(function($$status) {
        $$status['soldierRank'] = $this.getCharacterRank($$status['soldierRankID']);
      });

      return _getCharacterMetaData(serverName, _result.characterID)
        .then(response => {

          //Set character pic
          if(response.profile_pic_url) {
            _result.pictureURL = response.profile_pic_url;
          }

          if(response.facebook_url) { _result.social.facebook = response.facebook_url; }
          if(response.twitch_url) { _result.social.twitch = response.twitch_url; }
          if(response.youtube_url) { _result.social.youtube = response.youtube_url; }
          if(response.mouseClick_gearCalc_url) { _result.social.mouseClick_gearCalcID = response.mouseClick_gearCalc_url; }

          if(response.hide_old_names) {
            _result.names.splice(1);
          }

          if(response.hide_old_legions) {
            _result.guilds.splice(1);
          }

        })
        .catch(() => { return _result; })
        .then(() => { return _result; });
    }

    //Normalize a collection specified on first param on date stored on second param
    function _normalizeCollectionDates(collection, propName) {
      collection.forEach(function($$element) {
        $$element[propName] = new Date($$element[propName]);
      });
      return collection;
    }

    //Sort dates
    function _dateSortFn(propName, sort) {
      if(sort == 'asc') {
        return function(a, b) {
          return a[propName].getTime() - b[propName].getTime();
        };
      }
      else {
        return function(a, b) {
          return b[propName].getTime() - a[propName].getTime();
        };
      }
    }

    //Normalize the date
    function _normalizeDateString(dateString) {
      var _date = new Date(dateString);

      if(!isNaN(_date.getTime())) {
        return _date;
      }

      var _splitDate = dateString.split('-');

      return new Date(parseInt(_splitDate[2]), parseInt(_splitDate[0]) - 1, parseInt(_splitDate[1]));
    }


    /**
     * Retrieves character meta data
     * @param serverName
     * @param characterId
     * @private
     */
    function _getCharacterMetaData(serverName, characterId) {
      return $hs.$q.likeNormal($http({
        'url': '/v1/characters/' + serverName + '/' + characterId,
        'method': 'GET'
      }));
    }

  }

})(angular);
