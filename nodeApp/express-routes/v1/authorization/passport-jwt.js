(() => {

  const $config = require('../../../../config');

  const JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;

  const jwt = require('jsonwebtoken');


  class Passport {

    constructor() {
      this.passport = null;
    }

    /**
     *
     * @param passport
     */
    init (passport) {

      this.passport = passport;

      //Set up options
      let _options = {
        'jwtFromRequest': ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        'secretOrKey': $config.authorization.secret
      };

      //Initialize passport
      this.passport.use('jwt', new JwtStrategy(_options, (jwt_payload, done) => {
        return done(null, {'user': 'admin'});
      }));
    }

    /**
     * Serializes an item
     * @param item
     * @return {*}
     */
    serialize (item) {
      return jwt.sign(item, $config.authorization.secret);
    }

    /**
     * Authorize method
     * @return {Function}
     */
    authorize () {
      return this.passport.authenticate('jwt', {'session': false});
    }
  }


  module.exports = new Passport();

})();