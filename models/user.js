const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require('passport-local-mongoose');


/*const userSchema = mongoose.Schema({
  firstname: { type: String, required: false},
  lastname: {type: String, required: false },
  email: { type: String, required: true, unique: true },
  telnum: { type: String, required: false },
  password: { type: String, required: false },
  name: {type: String, required: false},
  imageUrl: {type: String, required: false},
  facebookId: String,
  admin: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
*/

const Schema = mongoose.Schema;

const Shipping_Address = new Schema({
  state: {
    type: String,
    default: ''
  },
  lga: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  can_save: {
    type: Boolean,
  }
},
{
  timestamps: true
});

const User = new Schema({
  firstname: {
    type: String,
      default: ''
  },
  lastname: {
    type: String,
      default: ''
  },
  email: {
    type: String,
    default: ''
  },
  telnum: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  admin:   {
      type: Boolean,
      default: false
  },
  shipping_address: [Shipping_Address]
},
{
  timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);