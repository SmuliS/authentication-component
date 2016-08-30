const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const db = require('../extensions/db');

function initializeStrategy() {
  //TODO REFACTOR TO USE CORE!
  const localStrategy = new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      return db
        .select(['id', 'password'])
        .from('user')
        .where({ email })
        .limit(1)
        .then(validatePassword);

      function validatePassword(users) {
        const user = users[0];
        if (user && user.password === password) {
          return done(null, user);
        }
        return done(null, false);
      }
    }
  );

  passport.use(localStrategy);
}

function initializeRoutes(router) {
  router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    (req, res) => {
      const response = res;
      response.json({ token: jwt.sign({ id: req.user.id }, 'secret') });
      response.status = 200;
      return response;
    }
  );
}

module.exports = {
  initializeRoutes,
  initializeStrategy,
};
