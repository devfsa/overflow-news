import './bootstrap';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { Post, Feed } from './models';
import graphqlRouter from './graphql';
import moment from 'moment';

const app = express();
const { PORT = 8080 } = process.env;
const Raven = require('raven');

Raven.config(process.env.SENTRY_DSN).install();
app.locals.moment = moment;

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('cache', false);

// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());
app.use(cors());
app.use(graphqlRouter);

app.get('/feeds', async (req, res) => {
  const feeds = await Feed.find({})
    .limit(50)
    .sort({ 'date': -1 });
  res.render('feeds', { feeds });
});

const listPosts = async (req, res) => {
  const perPage = 30;
  const { page = 1 } = req.params;
  const offset = (perPage * page) - perPage;

  const [ posts, count] = await Promise.all([
    Post.find({})
      .skip(offset)
      .limit(perPage)
      .sort({ 'date': -1 }),
    Post.count({})
  ]);

  const pages = Math.ceil(count / perPage);

  res.render('index', { posts, count, perPage, pages, currentPage: page });
}

app.get('/', listPosts);
app.get('/posts/:page', listPosts);

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

app.listen(PORT);
