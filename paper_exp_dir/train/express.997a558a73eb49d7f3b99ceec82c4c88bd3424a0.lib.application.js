

var finalhandler = require('finalhandler');
var mixin = require('utils-merge');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var resolve = require('path').resolve;



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


this.on('mount', function(parent){
this.request.__proto__ = parent.request;
this.response.__proto__ = parent.response;
this.engines.__proto__ = parent.engines;
this.settings.__proto__ = parent.settings;
});


this.locals = Object.create(null);


this.mountpath = '/';


this.locals.settings = this.settings;


this.set('view', View);
this.set('views', resolve('views'));
this.set('jsonp callback name', 'callback');

if (env === 'production') {
this.enable('view cache');
}

Object.defineProperty(this, 'router', {
get: function() {
throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
}
});
};


app.lazyrouter = function() {
if (!this._router) {
this._router = new Router({
caseSensitive: this.enabled('case sensitive routing'),
strict: this.enabled('strict routing')
});

this._router.use(query());
this._router.use(middleware.init(this));
}
};



app.handle = function(req, res, done) {
var router = this._router;


done = done || finalhandler(req, res, {
env: this.get('env'),
onerror: logerror.bind(this)
});


if (!router) {
debug('no routes defined on app');
done();
return;
}

router.handle(req, res, done);
};



app.use = function use(path, fn) {
var mount_app;
var mount_path;


if (arguments.length <= 2) {
mount_path = typeof path === 'string'
? path
: '/';
mount_app = typeof path === 'function'
? path
: fn;
