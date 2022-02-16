var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
clc = require('cli-color'),
mime = require('mime'),
url = require('url');

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config;

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
else app.use(connect.logger());
}

console.log('Loading.');

require('../generate')({preview: true}, function(){
var list = route.list(),
get = route.get;

app.use(connect.static(hexo.public_dir));

app.use(function(req, res){
var uri = url.parse(req.url).pathname,
target = get(uri);
