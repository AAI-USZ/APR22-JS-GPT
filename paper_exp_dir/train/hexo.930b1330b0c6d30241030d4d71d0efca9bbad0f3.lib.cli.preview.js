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

app.use(function(req, res){
var uri = url.parse(decodeURIComponent(req.url)).pathname,
target = get(uri);

if (target){
target(function(err, result, source){
if (err) throw err;

res.statusCode = 200;
res.setHeader('Content-Type', mime.lookup(source));
