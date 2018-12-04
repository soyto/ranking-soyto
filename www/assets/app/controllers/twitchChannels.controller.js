(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'mainApp.twitchChannels.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var characterSocialService = $hs.$instantiate('characterSocialService');
    var twitchService = $hs.$instantiate('twitchService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var $interval = $hs.$instantiate('$interval');

    var _streamInterval;

    var _data = {
      'streams': [],
      '$$state': {
        'loading': true
      }
    };


    _init();

    /* --------------------------------- SCOPE FUNCTIONS -----------------------------------------------------------  */


    /* --------------------------------- PRIVATE FUNCTIONS ---------------------------------------------------------  */

    //Initialize
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      $hs.$scope
        .setTitle('Twitch Channels | Soyto\'s Aion ranking tool')
        .setDescription('Twitch channels associated with each character on Soyto\'s character ranking')
        .setKeywords('soyto aion ranking pvp characters')
        .setNav('twitchChannels');

      storedDataService.getTwitchCharacters().then($$data => {

        _data.streams = $$data.map(x => {
          return {
            'character': x,
            'channel_id': null,
            'channel': null,
            'stream': null,
            'isOnline': false
          };
        }).map(x => {
          x.character.soldierRank = storedDataService.getCharacterRank(x.character.soldierRankID);
          x.character.characterClass = storedDataService.getCharacterClass(x.character.characterClassID);
          return x;
        });

      }).then(_setUpStreams)
        .then(() => _data.$$state.loading = false);
    }

    function _setUpStreams() {
      let _$$q = $hs.$q.resolve();

      let _promises = [];

      //Update all channels
      for(let stream of _data.streams) {
        let _twitchName = stream.character.social.twitch.split('/')[3];

        _promises.push(twitchService.getChannel(_twitchName)
          .then($$twitchChannel => {
            stream.channel = $$twitchChannel;
            stream.channel_id = $$twitchChannel._id;
          }).catch(x => {
            stream.has_error = true;
          }));
      }

      //Wait for all
      _$$q = _$$q.then(() => $hs.$q.all(_promises));

      //Remove streams with error
      _$$q = _$$q.then(() => {
        _data.streams = _data.streams.filter(x => !x.has_error);
      });

      //Get if streams are online or not
      _$$q = _$$q.then(() => {
        let _twitchChannels = _data.streams.map(x => x.character.social.twitch.split('/')[3]);

        return twitchService.getOnlinePeople(_twitchChannels)
          .then($$twitchStreams => {
            for(let $$twitchStream of $$twitchStreams.streams) {
              let _$$stream = _data.streams.filter(x => x.channel_id == $$twitchStream.channel._id).shift();

              if(_$$stream) {
                _$$stream.channel = $$twitchStreams.streams[0].channel;
                _$$stream.stream = $$twitchStreams.streams[0];
                _$$stream.isOnline = true;
              }
            }

          });
      });

      //Sort streams
      _$$q = _$$q.then(() => {
        _data.streams.sort((a, b) => {
          if(a.isOnline && !b.isOnline) { return -1; }
          if(!a.isOnline && b.isOnline) { return 1; }

          return a.character.characterName.localeCompare(b.character.characterName);
        });
      });

      return _$$q;
    }

    //Set up the streams
    function _setUpStreams_deprecated() {

      var _$q = $q.resolve();

      //First of all, update channels
      _$q = _$q.then(function() {
        var _$$qs = [];

        _data['streams'].forEach(function($$stream) {
          _$$qs.push(twitchService.getChannel($$stream['character']['buttons']['twitch'].split('/')[3])
            .then(function($$twitchChannel) {
              $$stream['channel'] = $$twitchChannel;
              $$stream['channel_id'] = $$twitchChannel['_id'];

              return storedDataService.getCharacterInfo(
                $$stream['character']['serverName'],
                $$stream['character']['characterID']).then(function($$characterInfo) {
                $$stream['info'] = $$characterInfo;
              });

            }).catch(function($$error) {
              _data['streams'].remove($$stream);
            })
          );
        });

        return $q.all(_$$qs);
      });

      _$q = _$q.then(function() {

        var _twitchChannelIDs = _data['streams']
          .select(function(x){ return x['character']['buttons']['twitch'].split('/')[3]; });

        //Try to know who is online
        return twitchService.getOnlinePeople(_twitchChannelIDs).then(function($$twitchStreams) {

          $$twitchStreams['streams'].forEach(function($$twitchStream) {
            var _streamItm = _data['streams'].first(function(x){ return x['channel_id'] == $$twitchStream['channel']['_id']; });
            _streamItm['channel'] = $$twitchStream['channel'];
            _streamItm['stream'] = $$twitchStream;
            _streamItm['isOnline'] = true;
          });


          //Sort people
          _data['streams'].sort(function(a, b) {

            if(a['isOnline'] && !b['isOnline']){ return -1; }
            if(!a['isOnline'] && b['isOnline']){ return 1; }

            return a['info']['characterName'].localeCompare(b['info']['characterName']);
          });

        });

      });

      return _$q;
    }

    /* --------------------------------- EVENTS FUNCTIONS ----------------------------------------------------------  */

  }
})(angular);