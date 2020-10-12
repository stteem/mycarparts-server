const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  category: {type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  userId: { type: String, required: false },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Item', itemSchema);