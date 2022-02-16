var paginator = require('./paginator'),
extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.tag,
publicDir = hexo.public_dir;

if (!config) return callback();

async.forEach(locals.tags.toArray(), function(item, next){
item.tag = item.name;

if (config == 2){
paginator(item.path, item, 'tag', render, next);
} else {
route.set(item.path, function(func){
var result = render('tag', item);
if (!result) result = render('archive', item);
if (!result) result = render('index', item);
