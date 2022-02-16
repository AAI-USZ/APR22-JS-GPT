


var basicAuth = require('../../../lib/express').basicAuth
, Post = require('../models/post');

module.exports = function(app){


app.all('/post(/*)?', basicAuth(function(user, pass){
return 'admin' == user && 'express' == pass;
}));



app.param('post', function(req, res, next, id){
Post.get(id, function(err, post){
if (err) return next(err);
if (!post) return next(new Error('failed to load post ' + id));
req.post = post;
next();
});
});



app.get('/post/add', function(req, res){
res.render('post/form', { post: {}});
});



app.post('/post', function(req, res){
var data = req.body.post || {}
, post = new Post(data.title, data.body);

post.validate(function(err){
if (err) {
req.flash('error', err.message);
return res.redirect('back');
}

post.save(function(err){
req.flash('info', 'Successfully created post _%s_', post.title);
res.redirect('/post/' + post.id);
});
});
});



app.get('/post/:post', function(req, res){
res.render('post', { post: req.post });
});



app.get('/post/:post/edit', function(req, res){
res.render('post/form', { post: req.post });
});



app.put('/post/:post', function(req, res, next){
var post = req.post;
post.validate(function(err){
if (err) {
req.flash('error', err.message);
return res.redirect('back');
}
post.update(req.body.post, function(err){
if (err) return next(err);
req.flash('info', 'Successfully updated post');
res.redirect('back');
});
});
});
};
