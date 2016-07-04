var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/models');
var User = mongoose.model('User');


router.route('/users')

    .post(function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function (err, user) {
            if (err) {
                return res.send(500, err)
            }
            return res.json(user);
        });

    })

    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(users);
        });
    });

router.route('/users/:username')

    .get(function (req, res) {
       User.findOne({username: req.params.username}, function(err, user){
           if (err) {
               return res.send(500, err);
           }
           return res.json(user);
       });
    });

router.route('/search/:username')
    .get(function (req, res) {
       User.find(function (err, users){
           if (err) {
               return res.send(500, err);
           }
           var userSearched =[];
           for( var i = 0; i<users.length; i++){
               if(users[i].username.indexOf(req.params.username) != -1) {
                   userSearched.push(users[i]);
               }
           }
           return res.send(userSearched);
       });
    });

module.exports = router;

