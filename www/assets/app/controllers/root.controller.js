(ng => {
  const CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,['$hs', _fn]);


  function _fn($hs) {

    var $rs = $hs.$instantiate('$rootScope');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var cfpLoadingBar = $hs.$instantiate('cfpLoadingBar');
    var $uibModal = $hs.$instantiate('$uibModal');
    var $templateCache = $hs.$instantiate('$templateCache');
    var $cookies = $hs.$instantiate('$cookies');
    var $moment = $hs.$instantiate('$moment');

    const authService = $hs.$instantiate('mainApp.auth.service');


    let _data = {
      'currentUser': {
        'value': null,
        'promise': null
      }
    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/


    /**
     * Gets current user
     * @return {*}
     */
    $rs.getCurrentUser = function() {
      return _data.currentUser.promise.then(() => {
        return _data.currentUser.value;
      });
    };

    /**
     * Removes current user
     */
    $rs.removeCurrentUser = function() {
      delete _data.currentUser.value;
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -------------------------------------------------*/

    function _init() {
      $rs._NAME = CONTROLLER_NAME;
      $rs.$$currentPath = $location.path();

      $rs.data = _data;

      _data.currentUser.promise = _getCurrentUser();

      if(!$cookies.get('gdprPolicy')) {
        $uibModal.open({
          'animation': false,
          'template': $templateCache.get('gdprPolicy.modal.tpl.html'),
          'size': 'lg',
          'backdrop': 'static',
          'controller': ['$uibModalInstance', '$scope', function($instance, $msc) {
            $msc.onClick_confirm = function() {
              $instance.close();
            };
          }]
        }).result.then(function() {
          $cookies.put('gdprPolicy', true, {'expires': $moment().add('months', 3). toDate() });
        });
      }
    }

    /**
     * Retrieves current user from service
     * @return {Promise.<TResult>}
     * @private
     */
    function _getCurrentUser() {
      return authService.check().then(userData => {
        _data.currentUser.value = userData;
      });
    }

    /*--------------------------------------------  WATCHER FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  EVENT FUNCTIONS  -------------------------------------------------*/

    $rs.$on('$routeChangeStart', event => {
      cfpLoadingBar.start();
    });

    $rs.$on('$viewContentLoaded', event => {
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', {'page': $location.path() });
      $rs.$$currentPath = $location.path();
    });

  }

})(angular);