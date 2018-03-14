const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    source: String,
    url: String,
    title: String,
    date: { type: Date, default: Date.now },
    author: String,
    rss: { type: String, unique: true },
    categories: Array
});

module.exports = mongoose.model('Post', PostSchema);