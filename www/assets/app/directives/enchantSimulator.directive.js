(function(ng){

  var DIRECTIVE_NAME = 'enchantSimulator';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {

    var enchantService = $hs.$instantiate('enchantService');

    function _controller($sc) {

      var _data = {
        'currentLevel': 0,
        'gearType': 'ancient',
        'usage': {
          'ancient': 0,
          'legendary': 0,
          'ultimate': 0
        },
        '$$state': {
          'completed': false,
          'animating': false,
          'enchantResult': null
        }
      };

      _init();

      /* --------------------------------- PUBLIC FUNCTIONS ----------------------------------------------------------*/

      /**
       * When gear type changes
       */
      $sc.onChange_gearType = function() {
        _reset();
      };

      /**
       * On click on enchant
       * @param stoneType
       */
      $sc.onClick_enchant = function(stoneType) {
        _enchant(stoneType);
      };

      /**
       * On click on reset
       */
      $sc.onClick_reset = function() {
        _reset();
      };

      $sc.onAnimationEnd = function() {
        _data.$$state.animating = false;
      };

      /* --------------------------------- PRIVATE FUNCTIONS ---------------------------------------------------------*/

      /**
       * Init Fn
       * @private
       */
      function _init() {
        $sc.data = _data;
      }

      /**
       *
       * @param stoneType
       * @private
       */
      function _enchant(stoneType) {
        if(_data.$$state.animating) { return; }

        var _enchantResult = enchantService.enchant(_data.gearType, stoneType, _data.currentLevel);

        _data.$$state.animating = true;

        if(_enchantResult == _data.currentLevel + 1) {
          _data.$$state.enchantResult = 'success';
        }
        else if(_enchantResult == _data.currentLevel + 2){
          _data.$$state.enchantResult = 'critical';
        }
        else {
          _data.$$state.enchantResult = 'failure';
        }


        if(_enchantResult != null) {
          _data.currentLevel = _enchantResult;
          _data.usage[stoneType]++;

          if(_enchantResult === 15) {
            _data.$$state.completed = true;
          }
        }
      }

      /**
       * Reset function
       * @private
       */
      function _reset() {
        _data.currentLevel = 0;
        _data.usage.ancient = 0;
        _data.usage.legendary = 0;
        _data.usage.ultimate = 0;

        _data.$$state.completed = false;
      }

    }

    function _linkFn($sc, $element, $attr) {
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {},
      'controller': ['$scope', _controller],
      'templateUrl': '/assets/app/templates/directives/enchantSimulator.html'
    };
  }
})(angular);
