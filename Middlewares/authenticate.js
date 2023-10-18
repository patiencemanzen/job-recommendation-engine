import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your-secret-key',
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ _id: jwt_payload.sub });

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport.authenticate('jwt', { session: false });
