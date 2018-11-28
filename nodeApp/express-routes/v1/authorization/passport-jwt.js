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
     * Initialize that passport method
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
     * Authorize method, ir role is added will check if user has role to perform action
     * @param role
     * @return {Function}
     */
    authorize (role) {

      //If there are no role, it's easy
      if(!role) {
        return this.passport.authenticate('jwt', {'session': false});
      }
      else {

        //Generate specialized middleware
        return (req, res, next) => {

          //Call to passport middleware
          this.passport.authenticate('jwt', {'session': false}, (error, user, info) => {

            if(user && user.role == role) {
              req.user = user;
              next();
            }
            else {
             res.status(401);
             res.end();
            }

          })(req, res, next);
        };
      }
    }
  }


  module.exports = new Passport();

})();