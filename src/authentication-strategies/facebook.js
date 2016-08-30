const FacebookStrategy = require('passport-facebook').Strategy;
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const users = require('../core/user-core');

const API_URL = 'https://graph.facebook.com';
const API_VERSION = 'v2.7';

function initializeStrategy() {
  function createUser(user) {
    return users.create({
      email: user.email,
      facebook_id: user.id,
    }).then(users.find({ email: user.email }));
  }

  function fetchEmail(profile) {
    const params = `access_token=${process.env.FACEBOOK_API_TOKEN}&fields=email&format=json`;
    const url = `${API_URL}/${API_VERSION}/${profile.id}?${params}`;
    return fetch(url);
  }

  function getOrCreate(data) {
    return users.find({ email: data.email })
      .then(user => user || createUser());
  }

  const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.HOST}/auth/facebook/callback`,
  },
  (accessToken, refreshToken, profile, cb) =>
    fetchEmail(profile)
      .then(res => res.json())
      .then(getOrCreate)
      .then(user => cb(null, user))
  );
  passport.use(facebookStrategy);
}

function initializeRoutes(router) {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      if (!req.user) {
        const err = new Error('Resource does not exist.');
        err.status = 404;
        throw err;
      }
      const response = res;
      response.json({ token: jwt.sign({ id: req.user.id }, 'secret') });
      response.status = 200;
      return res;
    }
  );
}

module.exports = {
  initializeStrategy,
  initializeRoutes,
};
