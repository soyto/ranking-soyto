(() => {

  const $config = require('../../../../config');

  const JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;
  const userService = require('../../../services').user;

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
      this.passport.use('jwt', new JwtStrategy(_options, async (jwt_payload, done) => {
        let _uuid = jwt_payload.uuid;

        if(!_uuid) {
          return done({'message': 'Invalid token'}, null);
        }

        let _user = await userService.get(_uuid);

        if(!_user) {
          return done({'message': 'Invalid token'}, null);
        }
        else {
          return done(null, _user);
        }

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