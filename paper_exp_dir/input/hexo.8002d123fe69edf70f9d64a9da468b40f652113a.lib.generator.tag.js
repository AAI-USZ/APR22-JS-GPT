var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.tag,
