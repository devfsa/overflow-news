const Queue = require('bull');
const CronJob = require('cron').CronJob;
const pino = require('pino')();
const mongoose = require('mongoose');
const path = require('path');

const rss = require('./lib/rss');
const job = require('./lib/job');
const Post = require('./models/post');

mongoose.connect(process.env.MONGO_URI);

rss.load(path.join(__dirname, process.env.FEEDS_FILE), function() {
  const cron = new CronJob({
    cronTime: '0 * * * *',
    onTick: function() {
      job.fetchLatestPosts(function(error) {
        if (error) pino.error(error);
      });
    },
    start: true,
    timeZone: 'America/Los_Angeles'
  });

  cron.start();
});

const queue = new Queue(process.env.CRAWL_QUEUE, process.env.REDIS_URI);

queue.process(5, function(task, done) {
  job.crawlFeed(task['data']['rss'], function(error, posts) {
    if (error) {
      return pino.error(error);
    }

    done(null, posts);
  });
});

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
      if (error) pino.error(error);
    });
  }
});