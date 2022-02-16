var connect = require('connect'),
colors = require('colors'),
mime = require('mime'),
url = require('url'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
generate = require('../generate');

hexo.cache.preview = true;

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

