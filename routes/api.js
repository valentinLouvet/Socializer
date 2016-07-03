var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/models');
var Post = mongoose.model('Post');

//api for all posts
router.route('/posts')

//create a new post
    .post(function (req, res) {

        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.created_at = req.body.created_at;
        post.save(function (err, post) {
            if (err) {
                return res.send(500, err)
            }
            return res.json(post)
        });


    })

    .get(function (req, res) {
        Post.find(function (err, posts) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(posts);
        });
    });
//api for a specfic post
router.route('/posts/:id')

//create
    .put(function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err)
                res.send(err);

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function (err, post) {
                if (err)
                    res.send(err);

                res.json(post);
            });
        });
    })

    .get(function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
    })

    .delete(function (req, res) {
        Post.remove({
            _id: req.params.id
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.json("deleted :(");
        });
    });


module.exports = router;