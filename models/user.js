const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  firstName: {type: String, required: false},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  imageUrl: {type: String, required: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);