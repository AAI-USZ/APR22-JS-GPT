

'use strict';



var finalhandler = require('finalhandler');
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
var flatten = require('array-flatten');
var merge = require('utils-merge');
var resolve = require('path').resolve;
var slice = Array.prototype.slice;



var app = exports = module.exports = {};



var trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';



app.init = function init() {
this.cache = {};
this.engines = {};
this.settings = {};

this.defaultConfiguration();
};



app.defaultConfiguration = function defaultConfiguration() {
var env = process.env.NODE_ENV || 'development';


this.enable('x-powered-by');
this.set('etag', 'weak');
this.set('env', env);
this.set('query parser', 'extended');
this.set('subdomain offset', 2);
this.set('trust proxy', false);


Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
configurable: true,
value: true
});

debug('booting in %s mode', env);

this.on('mount', function onmount(parent) {

if (this.settings[trustProxyDefaultSymbol] === true
&& typeof parent.settings['trust proxy fn'] === 'function') {
delete this.settings['trust proxy'];
delete this.settings['trust proxy fn'];
}


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


app.lazyrouter = function lazyrouter() {
if (!this._router) {
this._router = new Router({
caseSensitive: this.enabled('case sensitive routing'),
strict: this.enabled('strict routing')
});

this._router.use(query(this.get('query parser fn')));
this._router.use(middleware.init(this));
}
};



app.handle = function handle(req, res, callback) {
var router = this._router;


var done = callback || finalhandler(req, res, {
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
}


this.lazyrouter();
var router = this._router;

fns.forEach(function (fn) {

if (!fn || !fn.handle || !fn.set) {
return router.use(path, fn);
}

debug('.use app under %s', path);
fn.mountpath = path;
fn.parent = this;


router.use(path, function mounted_app(req, res, next) {
var orig = req.app;
fn.handle(req, res, function (err) {
req.__proto__ = orig.request;
res.__proto__ = orig.response;
next(err);
});
});


fn.emit('mount', this);
}, this);

return this;
};



app.route = function route(path) {
this.lazyrouter();
return this._router.route(path);
};



app.engine = function engine(ext, fn) {
if (typeof fn !== 'function') {
throw new Error('callback function required');
}


var extension = ext[0] !== '.'
? '.' + ext
: ext;


this.engines[extension] = fn;

return this;
};



app.param = function param(name, fn) {
this.lazyrouter();

if (Array.isArray(name)) {
for (var i = 0; i < name.length; i++) {
this.param(name[i], fn);
}

return this;
}

this._router.param(name, fn);

return this;
};



app.set = function set(setting, val) {
if (arguments.length === 1) {

return this.settings[setting];
}

debug('set "%s" to %o', setting, val);


this.settings[setting] = val;


switch (setting) {
case 'etag':
this.set('etag fn', compileETag(val));
break;
case 'query parser':
