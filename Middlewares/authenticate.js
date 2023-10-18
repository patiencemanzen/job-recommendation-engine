const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'your-secret-key';

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload.sub }, (err, user) => {
            if (err) return done(err, false);
            if (user) return done(null, user);
            return done(null, false);
        });
    })
);

module.exports = passport.authenticate('jwt', { session: false });
