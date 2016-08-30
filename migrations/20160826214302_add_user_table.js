
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', (table) => {
    table.uuid('id').primary();
    table.string('email').index().unique().notNullable();
    table.string('password').notNullable();
    table.string('google_id').index().unique();
    table.string('facebook_id').index().unique();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('user');
};
