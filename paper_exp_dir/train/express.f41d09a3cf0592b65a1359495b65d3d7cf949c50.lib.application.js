

var connect = require('connect')
, mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, View = require('./view')
, http = require('http');



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.enable('etag');
var env = process.env.NODE_ENV || 'development';
this.set('env', env);
this.set('subdomain offset', 2);
