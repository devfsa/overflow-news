function crawlFeed(URL, callback) {
  const FeedParser = require('feedparser');
  const request = require('request');

  const feedparser = new FeedParser();
  let posts = [];

  request(URL)
  .on('error', function (error) {
    console.log('\x1b[31m[ERROR]\x1b[0m', error.message);
    callback(error);
  })
  .on('response', function () {
    this.pipe(feedparser);

    feedparser.on('error', function (error) {
      console.log('\x1b[31m[ERROR]\x1b[0m', error.message);
      callback(error);
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

function fetchLatestPosts() {
  const Feed = require('../models/feed');

  Feed.find({}, function (error, feeds) {
    if (error) {
      console.log('\x1b[31m[ERROR]\x1b[0m', error.message);
    } else {
      const Queue = require('bee-queue');
      const queue = new Queue(process.env.CRAWL_QUEUE, {
        redis: {
          host: process.env.REDIS_URI
        }
      });

      feeds.forEach(function (feed) {
        queue.createJob(feed).save();
      });

      console.log('\x1b[34m[INFO]\x1b[0m', `${feeds.length} feeds to crawl`);
    }
  });
}

module.exports = {
  crawlFeed,
  fetchLatestPosts
};
