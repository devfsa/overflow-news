import './bootstrap';
import path from 'path';

const Queue = require('bee-queue');
const CronJob = require('cron').CronJob;
const Raven = require('raven');

const rss = require('./lib/rss');
const job = require('./lib/job');

// Start raven to catch exceptions
Raven.config(process.env.SENTRY_DSN).install();

rss.load(path.join(__dirname, process.env.FEEDS_FILE), function() {
  const cron = new CronJob('00 59 * * * *', function() {
    job.fetchLatestPosts();
  }, null, true, 'America/Los_Angeles');

  cron.start();
});

const queue = new Queue(process.env.CRAWL_QUEUE, {
  redis: {
    host: process.env.REDIS_URI
  }
});

queue.process(5, function(task, done) {
  job.crawlFeed(task['data']['rss'], function(error, posts) {
    if (error) {
      done(error);
    } else {
      done(null, posts);
    }
  });
});

queue.on('succeeded', (task, result) => {
  const Post = require('./models/post');
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

  Post.insertMany(posts, {ordered: false}, function(error) {
    if (error) {
      console.log('\x1b[34m[INFO]\x1b[0m', `${posts.length} posts found`);
    } else {
      console.log('\x1b[32m[SUCCESS]\x1b[0m', `${posts.length} posts inserted`);
    }
  });
});

queue.on('retrying', (task, error) => {
  console.log(`Job ${task.id} failed with error ${error.message} but is being retried!`);
});

queue.on('error', (error) => {
  console.log(`A queue error happened: ${error.message}`);
});

queue.on('failed', (task, error) => {
  console.log(`Job ${task.id} failed with error ${error.message}`);
});

queue.on('stalled', (taskId) => {
  console.log(`Job ${taskId} stalled and will be reprocessed`);
});
