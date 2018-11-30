((ng) => {

  const SERVICE_NAME = 'mainApp.auth.service';
  const COOKIE_NAME = 'Authorization';

  ng.module('mainApp').service(SERVICE_NAME, ['$hs', _fn]);


  function _fn($hs) {
    let $this = this;

    let $http = $hs.$instantiate('$http');
    let $cookies = $hs.$instantiate('$cookies');

    /**
     * Gets authorization cookie
     */
    $this.getCookie = function() {
      return $cookies.get(COOKIE_NAME);
    };

    /**
     * Sets authorization cookie
     * @param token
     */
    $this.setCookie = function(token) {
      $cookies.put(COOKIE_NAME, token, {
        'expires': new Date('1/1/2030'),
      });
    };

    /**
     * Removes cookies
     */
    $this.removeCookie = function() {
      $cookies.remove(COOKIE_NAME);
    };


    /**
     * Check if user is logged in
     * @return {Promise.<*>}
     */
    $this.check = function() {

      //If there are not cookie, return null
      if(!$this.getCookie()) {
        return $hs.$q.resolve(null);
      }

      return $hs.$q.likeNormal($http.get('/v1/auth/check'));
    };

    /**
     * Logins in to the de application
     * @param username
     * @param password
     * @return {Promise.<TResult>|*}
     */
    $this.login = function(username, password) {
      return $hs.$q.likeNormal($http({
        'url': '/v1/auth/login',
        'method': 'POST',
        'data': {
          'username': username,
          'password': password
        }
      })).then($$data => {
        $this.setCookie('jwt ' + $$data.token);
        return $$data;
      });
    };
  }


})(angular);