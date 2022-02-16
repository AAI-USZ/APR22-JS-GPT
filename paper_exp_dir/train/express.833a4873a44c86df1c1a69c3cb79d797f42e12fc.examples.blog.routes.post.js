


var basicAuth = require('../../..').basicAuth
, Post = require('../models/post');

module.exports = function(app){



app.all('/post(/*)?', basicAuth(function(user, pass){
return 'admin' == user && 'express' == pass;
}));



app.param('post', function(req, res, next, id){
Post.get(id, function(err, post){
if (err) return next(err);
if (!post) return next(new Error('failed to load post ' + id));
