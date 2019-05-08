// var cors = require("cors");
const express        = require('express');
// const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();

const port = 8000;

// app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

require('./app/routes')(app, {});
app.listen(port, () => {
  console.log('We are live on ' + port);
});
