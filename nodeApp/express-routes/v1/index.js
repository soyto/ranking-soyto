(() => {

  const fs = require('fs');
  const express = require('express');
  const $path = require('path');
  const passport = require('passport');
  const bodyParser = require('body-parser');
  const session = require('express-session');

  const jwt = require('jsonwebtoken');

  const JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;

  let router = express.Router();

  router.use(bodyParser.json());

  router.use(passport.initialize());

  let opts = {
    'jwtFromRequest': ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    'secretOrKey': 'mySecret'
  };

  passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
    return done(null, jwt_payload.user);
  }));

  router.post('/login', async (req, res) => {
    res.json({
      'token': jwt.sign({
        'user': 'admin'
      }, 'mySecret')
    });
  });

  router.get('/test', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({'done': true});
  });


  module.exports = router;
})();