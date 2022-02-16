

'use strict';



var bodyParser = require('body-parser')
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');



exports = module.exports = createApplication;



function createApplication() {
var app = function(req, res, next) {
app.handle(req, res, next);
};

mixin(app, EventEmitter.prototype, false);
mixin(app, proto, false);


app.request = Object.create(req, {
app: { configurable: true, enumerable: true, writable: true, value: app }
})


app.response = Object.create(res, {
app: { configurable: true, enumerable: true, writable: true, value: app }
})

app.init();
return app;
}



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;
exports.Router = Router;



exports.json = bodyParser.json
exports.query = require('./middleware/query');
exports.static = require('serve-static');
exports.urlencoded = bodyParser.urlencoded



var removedMiddlewares = [
'bodyParser',
'compress',
'cookieSession',
'session',
'logger',
'cookieParser',
'favicon',
'responseTime',
'errorHandler',
'timeout',
'methodOverride',
'vhost',
'csrf',
'directory',
'limit',
'multipart',
'staticCache'
]

removedMiddlewares.forEach(function (name) {
Object.defineProperty(exports, name, {
get: function () {
throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
},
configurable: true
