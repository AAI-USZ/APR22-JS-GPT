

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, utils = connect.utils
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
this.set('env', process.env.NODE_ENV || 'development');
this.set('subdomain offset', 2);
debug('booting in %s mode', this.get('env'));


this.use(connect.query());
this.use(middleware.init(this));


this.on('mount', function(parent){
this.request.__proto__ = parent.request;
this.response.__proto__ = parent.response;
this.engines.__proto__ = parent.engines;
this.settings.__proto__ = parent.settings;
});


this._router = new Router(this);
this.routes = this._router.map;
this.__defineGetter__('router', function(){
this._usedRouter = true;
this._router.caseSensitive = this.enabled('case sensitive routing');
this._router.strict = this.enabled('strict routing');
return this._router.middleware;
});


this.locals = locals(this);


this.locals.settings = this.settings;


this.set('view', View);
this.set('views', process.cwd() + '/views');
this.set('jsonp callback name', 'callback');

if (this.get('env') === 'production') {
this.enable('view cache');
};
};



app.use = function(route, fn){
var app;


if ('string' != typeof route) fn = route, route = '/';
