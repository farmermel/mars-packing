exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(() => {
      return Promise.all([
        knex('items').insert({ name: 'The Martian', packed: false }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};