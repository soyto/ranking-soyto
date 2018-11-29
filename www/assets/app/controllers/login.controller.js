((ng) => {

  const CONTROLLER_NAME = 'mainApp.login.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$hs', '$scope', _fn]);

  function _fn($hs, $sc) {


    let _data = {

    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  PRIVATE FUNCTIONS  -------------------------------------------------*/

    /**
     * Init function
     * @private
     */
    function _init() {
      $sc.data = _data;
      $sc._NAME = CONTROLLER_NAME;

    }

    /*--------------------------------------------  WATCHER FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  EVENT FUNCTIONS  -------------------------------------------------*/



  }


})(angular);