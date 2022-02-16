var connect = require('connect'),
term = require('term'),
mime = require('mime'),
url = require('url'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
generate = require('../../generate'),
inited = false;

hexo.cache.preview = true;

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
