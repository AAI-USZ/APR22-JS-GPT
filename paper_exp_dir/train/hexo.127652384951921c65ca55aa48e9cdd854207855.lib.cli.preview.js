var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
clc = require('cli-color');

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config;

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
else app.use(connect.logger());
}

require('../generate')({preview: true}, function(){
var list = route.list(),
get = route.get;

app.use(connect.static(hexo.public_dir));

app.use(function(req, res){
var url = req.url,
target = get(url);

if (target){
target(function(err, result){
if (err) throw err;

if (result.readable){
result.pipe(res).on('error', function(err){
