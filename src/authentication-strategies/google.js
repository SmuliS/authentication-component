const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const passport = require('passport');

const users = require('../core/user-core');

function initializeStrategy() {
  const googleStrategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      users.find({ email: profile.emails[0].value }).then(user => {
        if (user) {
          return cb(null, user);
        }
        return users.create({
          email: profile.emails[0].value,
          google_id: profile.id,
        }).then(newUser => cb(null, newUser));
      });
    }
  );

  // For some reason { session: false} does not work with google Strategy
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.use(googleStrategy);
}

function initializeRoutes(router) {
  router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

  router.get(
    '/auth/google/callback',
    passport.authenticate('google',
    { failureRedirect: '/login' }),
    (req, res) => {
      if (!req.user) {
        const err = new Error('Resource does not exist.');
        err.status = 404;
        throw err;
      }
      const response = res;
      response.json({ token: jwt.sign({ id: req.user.id }, 'secret') });
      response.status = 200;
      return response;
    }
  );
}

module.exports = {
  initializeStrategy,
  initializeRoutes,
};
