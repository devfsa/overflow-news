const FeedParser = require('feedparser');
const request = require('request');
const kue = require('kue');
const Feed = require('../models/feed');

function crawlFeed(URL, callback) {
  const feedparser = new FeedParser();
  let posts = [];

  request(URL)
  .on('error', function (error) {
    return callback(error);
  })
  .on('response', function () {
    this.pipe(feedparser);

    feedparser.on('error', function (error) {
      return callback(error);
    });

    feedparser.on('readable', function () {
      for (let post=this.read(); post; post=this.read()) {
        posts.push(post);
      }
    });

    feedparser.on('end', function () {
      callback(null, posts);
    });
  });
}

function fetchLatestPosts(callback) {
  Feed.find({}, function (error, feeds) {
    if (error) {
      return callback(error);
    }

    const queue = kue.createQueue({ redis: process.env.REDIS_URI });

    feeds.forEach(function (feed) {
      queue.create(process.env.CRAWL_QUEUE, feed).save();
    });

    callback(null);
  });
}

module.exports = {
  crawlFeed,
  fetchLatestPosts
};