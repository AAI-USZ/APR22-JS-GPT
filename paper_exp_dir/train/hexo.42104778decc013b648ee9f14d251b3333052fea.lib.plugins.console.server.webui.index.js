var express = require('express'),
_ = require('lodash'),
Controller = require('./controllers'),
config = hexo.config,
model = hexo.model;

module.exports = function(app){
var base = config.root + '_/';

app.set('views', hexo.core_dir + 'views');
app.set('view engine', 'ejs');
app.locals.root = config.root;
app.locals.base = base;
app.locals.config = config;
app.locals.version = hexo.version;
app.locals.site = model;
app.locals.layout = 'layout';
app.locals.cache = !hexo.debug;
app.locals._ = _;
app.engine('ejs', hexo.render.renderFile);

