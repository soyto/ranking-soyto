(() => {

  const express = require('express');
  const passport = require('passport');
  const bodyParser = require('body-parser');
  const passportJwt = require('./authorization/passport-jwt');

  let router = express.Router();

  //Setup basic routing
  router.use(bodyParser.json());
  router.use(passport.initialize());

  //Set up custom x-powered-by
  router.use((req, res, next) => {
    res.header('X-Powered-By', 'soyto.org');
    next();
  });

  //Init passport
  passportJwt.init(passport);

  //Authorization users
  router.use('/auth/', require('./auth'));
  router.use('/characters', require('./characters'));

  module.exports = router;
})();