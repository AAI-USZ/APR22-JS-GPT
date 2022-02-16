




var http = require('http')
, connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, req = require('./request')
, res = require('./response')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0alpha1-pre';



function createApplication() {
var app = connect();
utils.merge(app, proto);
app.request = { __proto__: req };
app.response = { __proto__: res };
app.init();
return app;
}



for (var key in connect.middleware) {
Object.defineProperty(
exports
, key
, Object.getOwnPropertyDescriptor(connect.middleware, key));
}



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;



exports.methods = require('./router/methods');



