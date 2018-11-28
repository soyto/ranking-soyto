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


  router.post('/login', async (req, res) => {
    res.json({
      'token': passportJwt.serialize({'user': 'admin'})
    });
  });

  router.get('/test', passportJwt.authorize(), (req, res) => {
    res.json({'done': true});
  });


  module.exports = router;
})();