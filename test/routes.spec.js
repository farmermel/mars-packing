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

  describe('GET /api/v1/items', () => {
    it('returns an array of all items and status 200', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('The Martian');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
      })
      .catch(error => {
        throw error;
      });
    });
  });

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

  describe('PATCH /api/v1/item/:id', () => {
    it.skip('returns the id and contents of patched item and status 200', () => {
      return chai.request(server)
      .patch('/api/v1/item/1')
      .send({
        packed: true
      })
      .then(response => {
        response.should.have.status(200);
        response.body.should.have.property('id');
        response.body.should.have.property('name');
        response.body.should.have.property('packed');
        response.body.packed.should.equal(false);
      })
      .catch(error => {
        throw error;
      })
    })

    it.skip('returns status of 422 if body is missing information', () => {
      return chai.request(server)
      .patch('/api/v1/item/1')
      .send({})
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('Expected body format: {packed:<boolean>}, missing packed');
      })
    })

    it.skip('returns status of 404 if item is not found in db', () => {

    })
  })
});