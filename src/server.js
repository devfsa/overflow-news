import './bootstrap'
import express from 'express'
import twig from 'twig'
import path from 'path'
import dotenv from 'dotenv'
import { Post, Feed } from './models'
import graphqlRouter from './graphql'

const app = express();

const { PORT = 8080 } = process.env;
app.set('views', path.join(__dirname, './views'))
// app.set('view engine', 'twig');
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('cache', false);

app.use(graphqlRouter);


app.get('/', async (req, res) => {
    const posts = await Post.find({})
        .limit(30)
        .sort({'date': -1});
    res.render('index', { posts });
});

app.get('/feeds', async (req, res) => {
    const feeds = await Feed.find({})
        .limit(50)
        .sort({'date': -1});
    res.render('feeds', { feeds });
});


app.listen(PORT);