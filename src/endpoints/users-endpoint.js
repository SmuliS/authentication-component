const createJsonRoute = require('./endpoint-utils').createJsonRoute;
const userCore = require('../core/user-core');
const userSchema = require('../schemas/user-schema');
const validate = require('../schemas/schema-utils').validate;

const getUser = createJsonRoute((req) =>
  validate(req.params, userSchema)
    .then(data => userCore.getOr404(data.userId))
);

module.exports = {
  getUser,
};
