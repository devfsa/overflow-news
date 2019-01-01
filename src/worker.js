const kue = require('kue');
const CronJob = require('cron').CronJob;
const pino = require('pino')();
const mongoose = require('mongoose');
const path = require('path');

const rss = require('./lib/rss');
const job = require('./lib/job');
const Post = require('./models/post');
const queue = kue.createQueue({ redis: process.env.REDIS_URI });

mongoose.connect(process.env.MONGO_URI);

// Application bootstrap. Run this script always on start
rss.load(path.join(__dirname, process.env.FEEDS_FILE), function() {
  const cron = new CronJob({
    cronTime: '0 * * * *',
    onTick: function() {
      job.fetchLatestPosts(function(error) {
        if (error) pino.error(error);
      });
    },
    start: false,
    timeZone: 'America/Los_Angeles',
    runOnInit: true
  });

  cron.start();
});

// Start to process tasks using concurrency
queue.process(process.env.CRAWL_QUEUE, 20, function(task, done) {
  job.crawlFeed(task['data']['rss'], function(error, result) {
    if (error) {
      return pino.error(error);
    }

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
      if ((error && error['writeErrors']) && error['writeErrors'].length === 0) {
        pino.error(error);
      }

      done(null);
    });
  });
});

// Remove completed jobs from the queue
queue.on('job complete', function(id) {
  kue.Job.get(id, function(error, task) {
    if (error) {
      pino.error(error);
    }

    task.remove(function(error) {
      if (error) {
        pino.error(error);
      }

      pino.info(`Job ${task.id} is completed and removed`);
    });
  });
});

// Stuck jobs clean up
queue.watchStuckJobs();