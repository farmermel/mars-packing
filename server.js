const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.json());

app.get('/api/v1/items', (request, response) => {
  database('items').select()
  .then(items => {
    return response.status(200).json(items);
  })
  .catch(error => {
    throw error;
  })
});

app.post('/api/v1/items', (request, response) => {
  if (!request.body.name) {
    return response
      .status(422)
      .send({ error: 'Expected body format: {name:<string>}, missing name' })
  };
  const postObj = { 
    name: request.body.name, packed: false
  };

  database('items').insert(postObj, 'id')
    .then(id => {
      return response.status(201).json({ id: id[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    });
});

app.patch('/api/v1/items/:id', async (request, response) => {
  if(request.body.packed === undefined) {
    return response
      .status(422)
      .send({ error: 'Expected body format: {packed:<boolean>}, missing packed' });
  };

  const reqItem = await database('items').where('id', request.params.id).select();
  if (!reqItem.length) {
    return response
      .status(404)
      .send({ error: 'No matching item found in database' })
  };
  database('items')
    .where('id', request.params.id)
    .update({ packed: request.body.packed })
    .then(id => {
      return response.status(200).json({ id })
    })
    .catch(error => {
      return response.status(500).send({ error })
    });
});

app.delete('/api/v1/items/:id', (request, response) => {
  database('items').where('id', request.params.id).del()
    .then(id => {
      return response.status(204).json(id);
    })
    .catch(error => {
      return response.status(500).send({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`)
});


module.exports = app;