const Joi = require('joi');

const schema = Joi.object().keys({
  userId: Joi.string().guid(),
});

module.exports = schema;
