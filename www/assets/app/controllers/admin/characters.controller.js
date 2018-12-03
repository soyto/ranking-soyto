(ng => {

  const CONTROLLER_NAME = 'mainApp.admin.characters.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$hs', '$scope', 'user', _fn]);

  function _fn($hs, $sc, user) {

    const $rs = $hs.$instantiate('$rootScope');

    let _data = {

    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  PRIVATE FUNCTIONS  -------------------------------------------------*/

    function _init() {
      $sc.data = _data;
      $sc._NAME = CONTROLLER_NAME;
    }

    /*--------------------------------------------  WATCHER FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  EVENT FUNCTIONS  -------------------------------------------------*/
  }

})(angular);