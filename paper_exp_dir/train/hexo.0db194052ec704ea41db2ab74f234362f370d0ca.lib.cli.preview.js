var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
colors = require('colors'),
mime = require('mime'),
url = require('url'),
watch = require('../watch');

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config,
generate = require('../generate');

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
