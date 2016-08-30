const express = require('express');
const usersEndpoint = require('./endpoints/users-endpoint');

const google = require('./authentication-strategies/google');
const facebook = require('./authentication-strategies/facebook');
const local = require('./authentication-strategies/local');

function createRouter() {
  const router = new express.Router();

  router.get('/users/:userId', usersEndpoint.getUser);

  local.initializeRoutes(router);

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    google.initializeRoutes(router);
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    facebook.initializeRoutes(router);
  }

  return router;
}

module.exports = createRouter;
