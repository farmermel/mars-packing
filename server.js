const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.use(bodyParser.json());



app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`)
});


module.exports = app;