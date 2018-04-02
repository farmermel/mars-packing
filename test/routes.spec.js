const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API ROUTES', () => {
  beforeEach((done) => {
  database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
        .then(() => {
          return database.seed.run()
          .then(() => {
            done()
        })
      })
    })
  })

  describe('POST /api/v1/items', () => {
    it('returns an id on successful post to db', () => {
      return chai.request(server)
      .post('/api/v1/items')
      .send({
        name: 'Space IceCream'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
      })
      .catch(error => {
        throw error;
      })
    })

    it('returns a status of 422 if request body is missing param', () => {
      return chai.request(server)
      .post('/api/v1/items')
      .send({})
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('Expected body format: {name:<string>}, missing name');
      })
      .catch(error => {
        throw error;
      })
    })
  })
});