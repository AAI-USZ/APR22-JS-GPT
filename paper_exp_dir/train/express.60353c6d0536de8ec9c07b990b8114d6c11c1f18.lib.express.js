




var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0alpha1';



function createApplication() {
var app = connect();
utils.merge(app, proto);
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



exports.Route = Route;


