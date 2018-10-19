(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  var ENCHANT_RATES = {
    'ancient_gear': {
      'ancient_stone':[88,88,88,68,68,68,48,48,48,28,28,28,28,28,28]
    },
    'legendary_gear': [100,100,100,88,88,88,68,68,68,48,48,48,48,48,48],
    'ultimate_gear': [100,100,100,98,98,98,78,78,78,58,58,58,58,58,58]
  };

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var enchantService = $hs.$instantiate('enchantService');

    //Search object
    var _search = {
      'term': '',
      'text': '',
      'results': null,
      'loading': false,
      'selectedIndex': null,
    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        _search['results'] = null;
        _search['selectedIndex'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function(){

        _search['term'] = text;
        _search['loading'] = true;
        _search['selectedIndex'] = null;

        //Google analytics event track
        $window.ga('send', 'event', 'search_event_category', 'index_search_action', text);

        return storedDataService.characterSearch(text).then(function($data){
          _search['results'] = $data;
          _search['loading'] = false;
        });
      }, 500);
    };

    //When user press a keydown on search panel
    $sc.onKeydown_searchPanel = function($event){

      if(_search['results'] == null || _search['results'].length === 0) {
        return;
      }
      else if(_search['selectedIndex'] === null) { //If we didnt started to navigate...

        //If user pressed on up arrow or down arrow..
        if($event.keyCode == 40 || $event.keyCode == 38) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter go to first result
        if($event.keyCode == 13) {
          var _searchItem = _search['results'][0];
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }
      }
      else { //If user already started the navigation

        //Down arrow without control
        if ($event.keyCode == 40 && !$event.ctrlKey) {
          _search['selectedIndex']++;

          if (_search['selectedIndex'] == _search['results'].length) {
            _search['selectedIndex'] = 0;
          }
          _scrollAndDontBubble();
        }

        //Down arrow with control
        else if ($event.keyCode == 40 && $event.ctrlKey) {
          _search['selectedIndex'] = _search['results'].length - 1;
          _scrollAndDontBubble();
        }

        //Up arrow without control
        else if ($event.keyCode == 38 && !$event.ctrlKey) {
          _search['selectedIndex']--;

          if (_search['selectedIndex'] === -1) {
            _search['selectedIndex'] = _search['results'].length - 1;
          }
          _scrollAndDontBubble();
        }

        //Up arrow with control
        else if ($event.keyCode == 38 && $event.ctrlKey) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter fo to the result
        else if($event.keyCode == 13) {
          /* jshint-W004 */
          var _searchItem = _search['results'][_search['selectedIndex']];
          /* jshint+W004 */
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }

        else {
          $sc.$broadcast('ngScrollTo.scroll', {
            'identifier': 'search-input'
          });
        }
      }

      function _scrollAndDontBubble(){
        $event.stopPropagation();
        $event.preventDefault();
        $sc.$broadcast('ngScrollTo.scroll', {
          'identifier': 'search-result-' + _search['selectedIndex']
        });
      }
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -----------------------------------------------*/

    //Init Fn
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;

      $sc['servers'] = storedDataService.serversList;
      $sc['lastServerUpdateData'] = storedDataService.getLastServerData();
      
      $sc['search'] = _search;

      $hs.$scope
        .setTitle('Soyto\'s Aion ranking tool')
        .setDescription('Soyto\'s tool for Aion PvP ranking on EU servers. \nLook for a character and see a lot of info related about it!')
        .setKeywords('soyto aion ranking pvp characters')
        .setNav('home');
    }

  }

})(angular);
