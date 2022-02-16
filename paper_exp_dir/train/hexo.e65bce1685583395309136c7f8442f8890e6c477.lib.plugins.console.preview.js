var express = require('express'),
term = require('term'),
path = require('path'),
ejs = require('ejs'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config;

extend.console.register('preview', 'Preview site', function(args){
var app = express(),
admin = args.a || args.admin ? true : false,
generate = require('../../generate');

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

if (config.logger){
if (config.logger_format) app.use(express.logger(config.logger_format));
else app.use(express.logger());
} else if (hexo.debug){
app.use(express.logger());
}

app.set('views', __dirname + '/../../../views');
app.set('view engine', 'ejs');
app.locals.layout = 'layout';
app.engine('ejs', require('../../render').__express);

if (admin){
app.get('/admin', function(req, res, next){
res.end('admin');
});

app.get('/admin/posts', function(){

