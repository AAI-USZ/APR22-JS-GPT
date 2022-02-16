

var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, send = require('send')
, utils = connect.utils;



exports = module.exports = createApplication;






exports.mime = send.mime;



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



exports.createServer = function(){
console.warn('Warning: express.createServer() is deprecated, express');
console.warn('applications no longer inherit from http.Server,');
console.warn('please use:');
console.warn('');
console.warn('  var express = require("express");');
console.warn('  var app = express();');
console.warn('');
return createApplication();
};



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;
exports.Router = Router;



exports.errorHandler.title = 'Express';

