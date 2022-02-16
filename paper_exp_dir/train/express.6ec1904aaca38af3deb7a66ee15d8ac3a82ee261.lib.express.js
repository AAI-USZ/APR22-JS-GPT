

var EventEmitter = require('events').EventEmitter;

var merge = require('merge-descriptors')
, mixin = require('utils-merge')

var proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')


require('./patch')



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



exports.static = require('serve-static');
