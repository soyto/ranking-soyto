((ng) => {

  const DIRECTIVE_NAME = 'ngFocusOn';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    /**
     * Link function
     * @param $sc
     * @param $element
     * @param $attr
     * @private
     */
    function _linkFn($sc, $element, $attr) {

      /**
       * When we get the ngFocusOn Event
       */
      $sc.$on('ngFocusOn', ($$event, name) => {

        let _value = $sc.$eval($attr[DIRECTIVE_NAME]);

        //Name isn't the same as the value
        if(name != _value) { return; }

        let _selector = $attr.ngFocusOnSelector? $sc.$eval($attr.ngFocusOnSelector) : null;

        //Focus the item
        if(!_selector) { $element.get(0).focus(); }
        else { $element.find(_selector).get(0).focus(); }
      });
    }


    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }


})(angular);