var express = require('express'),
path = require('path'),
colors = require('colors'),
async = require('async'),
_ = require('lodash'),
Controller = require('./controllers');

var config = hexo.config,
log = hexo.log,
model = hexo.model,
route = hexo.route,
publicDir = hexo.public_dir;

module.exports = function(args, callback){
var app = express(),
port = parseInt(args.p || args.port || config.port, 10),
loggerFormat = args.l || args.log,
root = config.root,
base = root + '_/';


if (args.port > 65535 || args.port < 1){
port = 4000;
}


app.set('views', path.join(hexo.core_dir, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', hexo.render.renderFile);


app.locals.layout = 'layout/app';
app.locals.version = hexo.version;
app.locals.config = hexo.config;
app.locals._ = _;
app.locals.cache = !hexo.debug;
app.locals.root = root;
app.locals.base = base;


if (loggerFormat){
app.use(express.logger(typeof loggerFormat === 'string' ? loggerFormat : config.logger_format));
} else if (config.logger || hexo.debug){
