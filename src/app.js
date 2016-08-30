const bodyParser = require('body-parser');
const passport = require('passport');
const createRouter = require('./router');
const express = require('express');

const local = require('./authentication-strategies/local');
const google = require('./authentication-strategies/google');
const facebook = require('./authentication-strategies/facebook');

const errorLogger = require('./extensions/error-logger');
const errorResponder = require('./extensions/error-responder');

function createApp() {
  const app = express();
  const router = createRouter();

  app.use(bodyParser.json());
  app.use('/', router);
  app.use(passport.initialize());


  app.use(errorLogger);
  app.use(errorResponder);

  local.initializeStrategy();
  google.initializeStrategy();
  facebook.initializeStrategy();

  return app;
}

module.exports = createApp;
