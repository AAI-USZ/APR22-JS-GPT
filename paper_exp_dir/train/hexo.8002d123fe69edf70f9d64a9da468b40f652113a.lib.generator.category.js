var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.category,
publicDir = hexo.public_dir;

if (!config) return callback();

console.log('Generating category archives.');

async.forEach(locals.categories.toArray(), function(item, next){
item.category = item.name;

if (config == 2){
