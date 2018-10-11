(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');

    //Search object
    var _search = {
      'term': '',
      'text': '',
      'results': null,
      'loading': false,
      'selectedIndex': null,
    };

    /*var _data = {
      'enchant_simulator': {
        'currentLevel': 0,
        'type': 'ancient',

        'usages': {
          'ancient': 0,
          'legendary': 0,
          'ultimate': 0
        },
        'chances': {
          'anceint': 0,
          'legendary': 0,
          'ultimate': 0
        }

      }
    };*/

    var _data = {
      'enchant_simulator': {
        'actual': 0,
        'geartype': 'a',
        'stones': [0,0,0],
        'rate': {
          'a': {
            'a': [88,88,88,68,68,68,48,48,48,28,28,28,28,28,28],
            'l': [100,100,100,88,88,88,68,68,68,48,48,48,48,48,48],
            'u': [100,100,100,98,98,98,78,78,78,58,58,58,58,58,58]
          },
          'l': {
            'a': [55,55,55,35,35,35,15,15,15,5,5,5,5,5,5],
            'l': [100,100,100,85,85,85,65,65,65,45,45,45,45,45,45],
            'u': [100,100,100,95,95,95,75,75,75,55,55,55,55,55,55]
          },
          'u': {
            'a': [52,52,52,32,32,32,12,12,12,5,5,5,5,5,5],
            'l': [100,100,100,82,82,82,62,62,62,42,42,42,42,42,42],
            'u': [100,100,100,92,92,92,72,72,72,52,52,52,52,52,52]
          }
        }
      }
      
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

    $sc.onClick_enchant = function(a) {
      _data.enchant_simulator.currentLevel ++;

      var rate,res1,res2;

      if (a == 'a'){
      	_data.enchant_simulator.stones[0]++;
      	rate = _data.enchant_simulator.rate[_data.enchant_simulator.geartype].a;
        
        res1 = Math.floor((Math.random() * 100) + 1);
        res2 = rate[_data.enchant_simulator.actual];
        
        $('#result1').html(res1);
        $('#result2').html(res2);
        
        if ( res1 <= res2){
        	//entra la piedra
        	if (Math.floor((Math.random() * 100) + 1) > 90){
          	//entra con crítico
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+2);
            $('#resultado').css('background','gold');
          } else {
          	//entra sin crítico
            $('#resultado').css('background','limegreen');
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+1);
          }
        } else {
        	//no entra la piedra
          $('#resultado').css('background','tomato');
          if (_data.enchant_simulator.actual >= 10) {
          	_data.enchant_simulator.actual = 10;
          } else {
          	_data.enchant_simulator.actual = Math.max(0,_data.enchant_simulator.actual-1);
          }

        }
      }
      if (a == 'l'){
      	_data.enchant_simulator.stones[1]++;
      	rate = _data.enchant_simulator.rate[_data.enchant_simulator.geartype].l;
        
        res1 = Math.floor((Math.random() * 100) + 1);
        res2 = rate[_data.enchant_simulator.actual];
        
        $('#result1').html(res1);
        $('#result2').html(res2);
        
        if ( res1 <= res2){
        	//entra la piedra
        	if (Math.floor((Math.random() * 100) + 1) > 90){
          	//entra con crítico
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+2);
            $('#resultado').css('background','gold');
          } else {
          	//entra sin crítico
            $('#resultado').css('background','limegreen');
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+1);
          }
        } else {
        	//no entra la piedra
          $('#resultado').css('background','tomato');
          if (_data.enchant_simulator.actual >= 10) {
          	_data.enchant_simulator.actual = 10;
          } else {
          	_data.enchant_simulator.actual = Math.max(0,_data.enchant_simulator.actual-1);
          }

        }
      }
      
      if (a == 'u'){
      	_data.enchant_simulator.stones[2]++;
      	rate = _data.enchant_simulator.rate[_data.enchant_simulator.geartype].u;
        
        res1 = Math.floor((Math.random() * 100) + 1);
        res2 = rate[_data.enchant_simulator.actual];
        
        $('#result1').html(res1);
        $('#result2').html(res2);
        
        if ( res1 <= res2){
        	//entra la piedra
        	if (Math.floor((Math.random() * 100) + 1) > 90){
          	//entra con crítico
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+2);
            $('#resultado').css('background','gold');
          } else {
          	//entra sin crítico
            $('#resultado').css('background','limegreen');
          	_data.enchant_simulator.actual = Math.min(15,_data.enchant_simulator.actual+1);
          }
        } else {
        	//no entra la piedra
          $('#resultado').css('background','tomato');
          /*if (_data.enchant_simulator.actual >= 10) {
          	_data.enchant_simulator.actual = 10;
          } else {
          	_data.enchant_simulator.actual = Math.max(1,_data.enchant_simulator.actual-1)
          }*/

        }
      }
      
      $('#as').html(_data.enchant_simulator.stones[0]);
      $('#ls').html(_data.enchant_simulator.stones[1]);
      $('#us').html(_data.enchant_simulator.stones[2]);
      $('#bpa').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].a[_data.enchant_simulator.actual]);
      $('#bpl').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].l[_data.enchant_simulator.actual]);
      $('#bpu').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].u[_data.enchant_simulator.actual]);
   
    };

    /**
     * On click on enchant reset
     */
    $sc.onClick_enchant_reset = function() {
      _data.enchant_simulator.actual = 0;
      _data.enchant_simulator.stones = [0,0,0];
      $('#levels').removeClass('a').removeClass('l').removeClass('u');
      if (_data.enchant_simulator.geartype == 'a'){
      	$('#levels').addClass('a');
      }
      if (_data.enchant_simulator.geartype == 'l'){
      	$('#levels').addClass('l');
      }
      if (_data.enchant_simulator.geartype == 'u'){
      	$('#levels').addClass('u');
      }
      $('#bpa').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].a[_data.enchant_simulator.actual]);
      $('#bpl').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].l[_data.enchant_simulator.actual]);
      $('#bpu').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].u[_data.enchant_simulator.actual]);
    };


    $sc.onClick_enchant_changetype = function() {
      _data.enchant_simulator.actual = 0;
      $('#levels').removeClass('a').removeClass('l').removeClass('u');
      if (_data.enchant_simulator.geartype == 'a'){
      	$('#levels').addClass('a');
      }
      if (_data.enchant_simulator.geartype == 'l'){
      	$('#levels').addClass('l');
      }
      if (_data.enchant_simulator.geartype == 'u'){
      	$('#levels').addClass('u');
      }
      $('#bpa').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].a[_data.enchant_simulator.actual]);
      $('#bpl').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].l[_data.enchant_simulator.actual]);
      $('#bpu').html(_data.enchant_simulator.rate[_data.enchant_simulator.geartype].u[_data.enchant_simulator.actual]);
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -----------------------------------------------*/

    //Init Fn
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;

      $sc['servers'] = storedDataService.serversList;
      $sc['lastServerUpdateData'] = storedDataService.getLastServerData();
      
      $sc['search'] = _search;

      $sc.data = _data;

      $hs.$scope
        .setTitle('Soyto\'s Aion ranking tool')
        .setDescription('Soyto\'s tool for Aion PvP ranking on EU servers. \nLook for a character and see a lot of info related about it!')
        .setKeywords('soyto aion ranking pvp characters')
        .setNav('home');
    }

  }

})(angular);
