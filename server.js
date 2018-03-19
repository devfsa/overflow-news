const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

const { PORT = 8080 } = process.env;

mongoose.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    const Post = require('./models/post');

    Post.find({})
    .limit(30)
    .sort({'date': -1})
    .exec(function(error, data) {
        res.render('index', {posts: data});
    });
});

app.listen(PORT);