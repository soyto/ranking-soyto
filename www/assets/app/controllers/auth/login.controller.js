((ng) => {

  const CONTROLLER_NAME = 'mainApp.auth.login.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$hs', '$scope', _fn]);

  function _fn($hs, $sc) {

    const $rs = $hs.$instantiate('$rootScope');
    const $location = $hs.$instantiate('$location');
    const authService = $hs.$instantiate('mainApp.auth.service');

    let _data = {
      'username': {
        'value': null,
        'error': null,
        'has_error': false
      },
      'password': {
        'value': null,
        'error': null,
        'has_error': false
      },
      '$$state': {
        'has_sent': false,
        'isValid': true,
        'global_error': null,
        'loading': {
          'login': false
        }
      }
    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/


    // -- USERNAME

    /**
     * When username changes
     */
    $sc.onChange_username = function() {
      _validate_username();
    };

    /**
     * On keydown username
     * @param $event
     */
    $sc.onKeydown_username = function($event) {
      if($event.keyCode === 13) {
        return _login();
      }
    };

    $sc.onFocus_username = function() {};

    $sc.onBlur_username = function() {};

    // -- PASSWORD

    /**
     * When password changes
     */
    $sc.onChange_password = function() {
      _validate_password();
    };

    /**
     * On keydown password
     * @param $event
     */
    $sc.onKeydown_password = function($event) {
      if($event.keyCode === 13) {
        return _login();
      }
    };

    $sc.onFocus_password = function() {};

    $sc.onBlur_password = function() {};

    // -- Button

    /**
     * When user press the login button
     */
    $sc.onClick_login = function() {
      _login();
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -------------------------------------------------*/

    /**
     * Init function
     * @private
     */
    function _init() {
      $sc.data = _data;
      $sc._NAME = CONTROLLER_NAME;

      $hs.$scope.setTitle('Login | Soyto\' Aion ranking tool');

      //Focus username input
      $hs.focus(CONTROLLER_NAME + '.username');

      if(authService.getCookie()) {
        $location.url('/');
      }
    }

    /**
     * Validates
     * @return {boolean}
     * @private
     */
    function _validate() {
      let _isValidUsername = _validate_username();
      let _isValidPassword = _validate_password();

      if(!_isValidUsername) { $hs.focus(CONTROLLER_NAME + '.username'); }
      else if(!_isValidPassword) { $hs.focus(CONTROLLER_NAME + '.password'); }

      return _isAllValid();
    }

    /**
     * ¿Is all valid?
     * @return {boolean}
     * @private
     */
    function _isAllValid() {
      return !(_data.username.has_error || _data.password.has_error);
    }

    /**
     * Validates username
     * @return {boolean}
     * @private
     */
    function _validate_username() {
      let _control = _data.username;

      _control.has_error = false;
      _control.error = null;
      _data.$$state.global_error = null;

      if(!_control.value || _control.value.trim().length === 0) {
        _control.has_error = true;
        _control.error = 'Should not be empty';
        _data.$$state.isValid = false;
      }

      if(!_control.has_error) {
        _data.$$state.isValid = _isAllValid();
      }

      return !_control.has_error;
    }

    /**
     * Validates password
     * @return {boolean}
     * @private
     */
    function _validate_password() {
      let _control = _data.password;

      _control.has_error = false;
      _control.error = null;
      _data.$$state.global_error = null;

      if(!_control.value || _control.value.trim().length === 0) {
        _control.has_error = true;
        _control.error = 'Should not be empty';
        _data.$$state.isValid = false;
      }

      if(!_control.has_error) {
        _data.$$state.isValid = _isAllValid();
      }

      return !_control.has_error;
    }

    /**
     * Login function
     * @private
     */
    function _login() {

      //Indicate that has sent
      _data.$$state.has_sent = true;

      if(!_validate()) { return; }

      //Show that we are loading
      _data.$$state.loading.login = true;

      //Do login
      authService.login(_data.username.value, _data.password.value).then($$result => {
        $rs.setCurrentUser($$result.user);
        $location.url('/');
      }).catch($$error => {
        _data.$$state.isValid = false;
        _data.$$state.global_error = $$error.message;

      }).finally(() => {
        _data.$$state.loading.login = false;
      });
    }

    /*--------------------------------------------  WATCHER FUNCTIONS  -------------------------------------------------*/

    /*--------------------------------------------  EVENT FUNCTIONS  -------------------------------------------------*/

  }


})(angular);