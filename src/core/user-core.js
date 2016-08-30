const uuid = require('uuid');
const knex = require('../extensions/db');

function create(data) {
  data.id = data.id || uuid.v4();
  return knex('user').insert(data);
}

function find(query) {
  return knex
    .select('*')
    .from('user')
    .where(query)
    .limit(1)
    .then(data => data[0]);
}

function getOr404(userId) {
  return knex
    .select('*')
    .from('user')
    .where({ id: userId })
    .limit(1)
    .then(returnRow)

  function returnRow(user) {
    if (user.length !== 1) {
      const err = new Error('Resource does not exist.');
      err.status = 404;
      throw err;
    }
    return user[0];
  }
}

module.exports = {
  create,
  find,
  getOr404,
};
