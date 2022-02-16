

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, compileETag = require('./utils').compileETag
, compileTrust = require('./utils').compileTrust
, View = require('./view')
, utils = connect.utils
, http = require('http');
var deprecate = require('depd')('express');



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.set('etag', 'weak');
var env = process.env.NODE_ENV || 'development';
this.set('env', env);
this.set('subdomain offset', 2);
this.set('trust proxy', false);

debug('booting in %s mode', env);


this.use(connect.query());
this.use(middleware.init(this));

