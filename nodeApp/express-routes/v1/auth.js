(() => {

  const express = require('express');

  const passportJwt = require('./authorization/passport-jwt');
  const $expressHelper = require('../../helpers').express;
  const userService = require('./../../services').user;

  let router = express.Router();

  /**
   * Login route
   */
  router.post('/login', async (req, res) => {

    //If we don't get username or password
    if(!req.body.username || !req.body.password) {
      return $expressHelper.notValid(res, 'Invalid username or password');
    }

    //Extract use from database
    let _user = await userService.getByUsername(req.body.username);

    //If we dont receive the user
    if(!_user) {
      return $expressHelper.notValid(res, 'Invalid username or password');
    }

    //If is not that password
    if(!(await _user.checkPassword(req.body.password))) {
      return $expressHelper.notValid(res, 'Invalid username or password');
    }

    //Generate token
    let _jwtToken = passportJwt.serialize({
      'uuid': _user.uuid,
    });

    //return token
    return res.json({
      'token': _jwtToken
    });

  });


  module.exports = router;
})();