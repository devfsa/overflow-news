const Queue = require('bull');
const CronJob = require('cron').CronJob;
const pino = require('pino')();
const mongoose = require('mongoose');
const path = require('path');

const rss = require('./lib/rss');
const job = require('./lib/job');
const Post = require('./models/post');
const queue = new Queue(process.env.CRAWL_QUEUE, process.env.REDIS_URI);

mongoose.connect(process.env.MONGO_URI);

// Application bootstrap
rss.load(path.join(__dirname, process.env.FEEDS_FILE), function() {
  const cron = new CronJob('0 * * * *', function() {
    job.fetchLatestPosts(function(error) {
      if (error) pino.error(error);
    });
  }, null, true, 'America/Los_Angeles');

  cron.start();
});

// Start to process tasks using concurrency
queue.process(5, function(task, done) {
  job.crawlFeed(task['data']['rss'], function(error, posts) {
    if (error) {
      return pino.error(error);
    }

    done(null, posts);
  });
});

// On task completed save result into DB
queue.on('completed', (task, result) => {
  if (result) {
    const posts = result.map(function(post) {
      return {
        sourceName: post.meta.title,
        sourceURL: post.meta.link,
        title: post.title,
        date: post.date,
        author: post.author,
        url: post.link,
        categories: post.categories
      };
    });

    Post.insertMany(posts, { ordered: false }, function(error) {
      if ((error && error['writeErrors']) && error['writeErrors'].length === 0) pino.error(error);
    });
  }
});