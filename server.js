const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    const Post = require('./models/post');

    Post.find({}).limit(50).exec(function(error, data) {
        res.render('pages/index', {posts: data});
    });
});

app.listen(8080);