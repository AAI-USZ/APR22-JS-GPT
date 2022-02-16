

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, utils = connect.utils
, path = require('path')
, http = require('http')
, join = path.join;



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.viewCallbacks = [];
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.set('env', process.env.NODE_ENV || 'development');
debug('booting in %s mode', this.get('env'));


this.use(connect.query());
this.use(middleware.init(this));


