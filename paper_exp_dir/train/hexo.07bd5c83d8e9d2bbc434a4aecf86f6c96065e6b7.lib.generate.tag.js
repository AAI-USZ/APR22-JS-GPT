var paginator = require('./paginator'),
extend = require('../extend'),
async = require('async');

extend.generate.register(function(locals, render, callback){
var config = hexo.config.tag,
tags = locals.tags,
keys = Object.keys(tags);

if (config){
async.forEach(keys, function(key, next){
var item = tags[key];
item.tag = key;
