const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const shopSchema = mongoose.Schema({
  shopname: {
    type: String, 
    required: true,
    unique: true
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
  }
},
{
  timestamps: true
});

shopSchema.plugin(uniqueValidator, { message: '{PATH} {VALUE} already exists.'});

module.exports = mongoose.model('Shop', shopSchema);