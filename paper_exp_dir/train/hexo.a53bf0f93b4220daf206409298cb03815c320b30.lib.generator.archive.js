var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async'),
_ = require('underscore');

extend.generate.register(function(locals, render, callback){
var posts = locals.posts,
config = hexo.config,
publicDir = hexo.public_dir;

if (!config.archive) return callback();

console.log('Generating archives.');

async.parallel([

function(next){
var target = config.archive_dir + '/';

posts.archive = true;

if (config.archive == 2){
paginator(target, posts, 'archive', render, next);
} else {
