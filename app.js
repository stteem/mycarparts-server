const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

const cors = require('./routes/cors');
const userRoutes = require('./routes/user');
const shopRoutes = require('./routes/shop');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');

const app = express();

const dotenv = require("dotenv");
dotenv.config();

// Initialize mongoose object
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

app.options('*', cors.cors);
// Set Headers
app.use((req, res, next) => {
  //console.log('app req 1 ', req.body);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});*/

//parse request body into a json object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/search', searchRoutes);

module.exports = app;