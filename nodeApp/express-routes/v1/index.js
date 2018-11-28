(() => {

  const express = require('express');
  const passport = require('passport');
  const bodyParser = require('body-parser');
  const passportJwt = require('./authorization/passport-jwt');

  let router = express.Router();

  //Setup basic routing
  router.use(bodyParser.json());
  router.use(passport.initialize());

  //Init passport
  passportJwt.init(passport);

  //Authorization users
  router.use('/auth/', require('./auth'));

  module.exports = router;
})();