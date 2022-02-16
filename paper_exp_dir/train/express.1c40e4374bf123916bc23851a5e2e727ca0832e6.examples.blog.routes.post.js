


var basicAuth = require('../../../lib/express').basicAuth
, Post = require('../models/post');



app.all('/post/*', basicAuth(function(user, pass){
return 'admin' == user && 'express' == pass;
}));



app.param('post', function(req, res, next, id){
Post.get(id, function(err, post){
if (err) return next(err);
if (!post) return next(new Error('failed to post user ' + id));
req.post = post;
next();
});
});



app.get('/post/add', function(req, res){
res.render('post/form', { post: {}});
});



app.post('/post', function(req, res){
var data = req.body.post
, post = new Post(data.title, data.body);
post.save(function(err){
res.redirect('/post/' + post.id);
});
});



