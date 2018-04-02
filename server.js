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

app.post('/api/v1/items', (request, response) => {
  if (!request.body.name) {
    return response
      .status(422)
      .send({ error: 'Expected body format: {name:<string>}, missing name' })
  }
  const postObj = { 
    name: request.body.name, packed: false
  };

  database('items').insert(postObj, 'id')
    .then(id => {
      return response.status(201).json({ id: id[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`)
});


module.exports = app;