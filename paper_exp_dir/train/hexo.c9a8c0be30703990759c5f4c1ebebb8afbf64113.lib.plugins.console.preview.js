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

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
