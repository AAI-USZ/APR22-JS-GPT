

var EventEmitter = require('events').EventEmitter;
var mixin = require('utils-merge');
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

mixin(app, proto);
mixin(app, EventEmitter.prototype);

app.request = { __proto__: req, app: app };
app.response = { __proto__: res, app: app };
app.init();
return app;
}



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;
exports.Router = Router;



exports.query = require('./middleware/query');
exports.static = require('serve-static');



[
'json',
'urlencoded',
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
'staticCache',
].forEach(function (name) {
Object.defineProperty(exports, name, {
get: function () {
throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
},
configurable: true
});
