const uuid = require('uuid');
const chance = require('chance').Chance();
const _ = require('lodash');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  function generate_users() {
    const n = 30000;
    console.log(`Generating next ${n} users`);

    return Promise.all(
      Array(n).fill().map(() => {
        return knex('user').insert({id: uuid.v4(), email: chance.email(), password: 'password'}).catch(function() {
          console.log('error')
        })
      })
    );
  }
  return knex('user').del()
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users)
    .then(generate_users);
};
