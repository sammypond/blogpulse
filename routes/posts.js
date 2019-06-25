const express = require('express');
const db = require('../models');
const router = express.Router();

// GET /posts/new - sends form for creating new post
router.get('/new', function(req, res){
    db.author.findAll()
    .then(function(authors){
        res.render('posts/new', {authors});
    });
});

// GET /posts/:id - returns selected post and its author
router.get('/:id', function(req, res){
    db.post.findOne({
        where: {id: parseInt(req.params.id)},
        include: [db.author, db.comment]
    }).then(function(post){
        res.render('posts/show', {post})
    });
});

// POST /posts - creates a new post record 
router.post('/', function(req, res){
    db.post.create({
        title: req.body.title,
        content: req.body.content,
        authorId: req.body.authorId
    }).then(function(post){
        res.redirect('/');
    });
});

router.post('/:id/comments', function(req, res){
    console.log("hit the route");
    db.post.findByPk(parseInt(req.params.id))
    .then(function(post){
        post.createComment({
            name: req.body.name,
            comment: req.body.comment
        }).then(function(comment){
            res.redirect('/posts/' + req.params.id)
        })
    })
});

module.exports = router;