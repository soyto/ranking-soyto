(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

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

    $rs['_name'] = CONTROLLER_NAME;

    $rs['$$currentPath'] = $location.path();

    $rs.$on('$routeChangeStart', function(event){
      cfpLoadingBar.start();
      $rs['oggs'] = [];
    });

    $rs.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', {'page': $location.path() });
      $rs['$$currentPath'] = $location.path();
    });

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

})(angular);