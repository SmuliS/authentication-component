const Joi = require('joi');
const Promise = require('bluebird');

const validate = Promise.promisify(Joi.validate);

module.exports = {
  validate,
};
