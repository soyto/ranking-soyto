(function(ng){

  var DIRECTIVE_NAME = 'enchantSimulator';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {


    function _linkFn($sc, $element, $attr) {
      var _data = {

      };

      $sc.data = _data;
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {},
      'templateUrl': '/assets/app/templates/directives/enchantSimulator.html'
    };
  }
})(angular);
