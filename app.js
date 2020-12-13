const express = require('express');
const bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

// Initialize mongoose object
mongoose.connect('mongodb+srv://dbSgn:bYy2nqHhX3IdI1Ca@signinwith.upshr.mongodb.net/Signinwith?retryWrites=true&w=majority', {
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

// Set Headers
//x-auth-token,
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Set Cors
/*var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));*/

//parse request body into a json object
app.use(bodyParser.json());

//app.use(cookieParser());

app.use('/api/v1/auth', userRoutes);


module.exports = app;