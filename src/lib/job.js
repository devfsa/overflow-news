const FeedParser = require('feedparser');
const request = require('request');
const Queue = require('bull');
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

    const queue = new Queue(process.env.CRAWL_QUEUE, process.env.REDIS_URI);

    feeds.forEach(function (feed) {
      queue.add(feed);
    });

    callback(null);
  });
}

module.exports = {
  crawlFeed,
  fetchLatestPosts
};