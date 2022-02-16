var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async'),
_ = require('underscore');

extend.generator.register(function(locals, render, callback){
var posts = _.clone(locals.posts),
config = hexo.config,
mode = config.archive,
publicDir = hexo.public_dir,
archiveDir = config.archive_dir + '/';

if (!config) return callback();

console.log('Generating archives.');

async.parallel([

function(next){
posts.archive = true;

if (mode == 2){
