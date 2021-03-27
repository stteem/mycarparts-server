const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const shopSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: { type: String, required: true },
  telnum: { type: String, required: true },
  email: {type: String, required: false, unique: true},
  description: {type: String, required: false}
});

shopSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Shop', shopSchema);