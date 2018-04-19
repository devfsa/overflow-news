const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  sourceName: String,
  sourceURL: String,
  title: String,
  date: { type: Date, default: Date.now },
  author: String,
  url: { type: String, unique: true },
  categories: Array
});

module.exports = mongoose.model('Post', PostSchema);
module.exports.default = module.exports;
