var express = require('express'),
path = require('path'),
async = require('async'),
_ = require('lodash'),
extend = require('../../../extend'),
route = require('../../../route'),
config = hexo.config,
log = hexo.log,
publicDir = hexo.public_dir;

extend.console.register('server', 'Run server', {alias: 's'}, function(args){
var app = express(),
statics = args.s || args.static,
logFormat = args.l || args.log,
admin = args.a || args.admin,
port = args.p || args.port || config.port || 4000;

if (logFormat){
app.use(express.logger(logFormat));
} else if (config.logger){
app.use(express.logger(config.logger_format));
} else if (hexo.debug){
app.use(express.logger(config.logger_format));
}

app.use(function(req, res, next){
res.header('x-powered-by', 'Hexo');
next();
});

if (admin){
require('./webui')(app);
}

if (!statics){
app.get(config.root + '*', function(req, res, next){
