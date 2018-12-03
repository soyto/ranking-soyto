((ng) => {

  const CONTROLLER_NAME = 'mainApp.auth.logout.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$hs', '$scope', _fn]);

  function _fn($hs, $sc) {

    const $rs = $hs.$instantiate('$rootScope');
    const $location = $hs.$instantiate('$location');
    const authService = $hs.$instantiate('mainApp.auth.service');

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  PRIVATE FUNCTIONS  -------------------------------------------------*/

    /**
     * Init function
     * @private
     */
    function _init() {
      $sc._NAME = CONTROLLER_NAME;

      authService.removeCookie();
      $location.url('/');
      $rs.removeCurrentUser();
    }

    /*--------------------------------------------  WATCHER FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  EVENT FUNCTIONS  -------------------------------------------------*/

  }


})(angular);