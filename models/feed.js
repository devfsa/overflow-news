const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
    rss: { type: String, unique: true },
    url: String,
    title: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feed', FeedSchema);