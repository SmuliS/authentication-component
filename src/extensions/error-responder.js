/* eslint no-unused-vars: ["error", {"args": "none"}] */
const http = require('http');

function errorResponder(err, req, res, next) {
  const status = err.status ? err.status : 500;
  const httpMessage = http.STATUS_CODES[status];

  let message;
  if (status === 404) {
    message = err.message;
  } else if (status < 500) {
    message = `${httpMessage}:${err.message}`;
  } else {
    message = httpMessage;
  }

  const response = { message };
  if (err.data) {
    response.errors = err.data;
  }

  res.status(status);
  res.send(response);
}

module.exports = errorResponder;
