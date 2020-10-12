//MongoDb Username: stteem
//MongoDb Password: Qk7wO91E66iANtf1
//Connection String: mongodb+srv://stteem:<password>@soteria.nt1zb.mongodb.net/<dbname>?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const Thing = require('./models/thing');
const userRoutes = require('./routes/user');
const itemsRoutes = require('./routes/items');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://stteem:Qk7wO91E66iANtf1@soteria.nt1zb.mongodb.net/Soteria?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//parse request body into a json object
app.use(bodyParser.json());

//allow access to the images folder/static resource
//Using the built-in  path  package and Express'  static  method,
// we can serve up static resources such as images
//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/items', itemsRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;