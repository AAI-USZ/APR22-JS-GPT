var paginator = require('./paginator'),
extend = require('../extend'),
async = require('async'),
_ = require('underscore');

extend.generate.register(function(locals, render, callback){
var posts = locals.posts,
config = hexo.config;

async.parallel([

function(next){
var target = config.archive_dir + '/';

if (config.archive === 2){
paginator(target, posts, 'archive', render, next);
} else {
render('archive', posts, function(err, result){
if (err) throw err;
file.write(publicDir + target + 'index.html', result, next);
});
}
