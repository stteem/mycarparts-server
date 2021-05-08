//const mongoose = require('mongoose');
const mongoose = require('mongoose').set('debug', true);
const uniqueValidator = require('mongoose-unique-validator');

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const partSchema = mongoose.Schema({
  vehicletype: {
    type: String, 
    required: true
  },
  model: {
    type: String, 
    required: true
  },
  year: {
    type: String, 
  },
  part: { 
    type: String, 
    required: true
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  imageurl: {
    type: String,
    required: true,
  },
  imageid: {
    type: String,
    required: true,
  },
  vendor:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
});


const shopSchema = mongoose.Schema({
  shopname: {
    type: String, 
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  state: {
    type: String, 
    required: true
  },
  lga: {
    type: String, 
    required: true
  },
  address: { 
    type: String, 
    required: true
  },
  telnum: { 
    type: String, 
    required: true 
  },
  email: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    default: ''
  },
  owner: {
    type: String
  },
  items: [partSchema]
},
{
  timestamps: true
});

shopSchema.plugin(uniqueValidator, { message: '{VALUE} already exists. Store name must be unique.'});

module.exports = mongoose.model('Shop', shopSchema);