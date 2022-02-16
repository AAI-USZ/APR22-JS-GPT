

var finalhandler = require('finalhandler');
var flatten = require('./utils').flatten;
var mixin = require('utils-merge');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileQueryParser = require('./utils').compileQueryParser;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var resolve = require('path').resolve;
var slice = Array.prototype.slice;



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
this.set('query parser', 'extended');
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

this._router.use(query(this.get('query parser fn')));
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



app.use = function use(fn) {
var offset = 0;
var path = '/';
var self = this;



if (typeof fn !== 'function') {
var arg = fn;

while (Array.isArray(arg) && arg.length !== 0) {
arg = arg[0];
}


if (typeof arg !== 'function') {
offset = 1;
path = fn;
}
}

var fns = flatten(slice.call(arguments, offset));

if (fns.length === 0) {
throw new TypeError('app.use() requires middleware functions');
