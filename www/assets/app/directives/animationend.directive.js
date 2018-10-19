(function(ng) {
  var DIRECTIVE_NAME = 'ngAnimationend';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {

    function _linkFn($sc, $element, $attr) {
      $element.get(0).addEventListener('animationend', function() {
        $sc.$apply(function() {
          $sc.$eval($attr[DIRECTIVE_NAME]);
        });
      });
    }

    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }

})(angular);