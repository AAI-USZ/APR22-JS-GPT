var chalk = require('chalk');
var table = require('text-table');
var common = require('./common');

function listPost(){
var Post = this.model('Post');

var data = Post.sort({published: -1, date: 1}).map(function(post){
var date = post.published ? post.date.format('YYYY-MM-DD') : 'Draft';
return [chalk.gray(date), post.title, chalk.magenta(post.source)];
});
