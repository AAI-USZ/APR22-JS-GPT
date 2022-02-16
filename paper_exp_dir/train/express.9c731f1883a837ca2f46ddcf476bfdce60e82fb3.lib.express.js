

var deprecate = require('depd')('express');
var merge = require('merge-descriptors');
var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.mime = connect.mime;



function createApplication() {
var app = connect();
utils.merge(app, proto);
app.request = { __proto__: req, app: app };
app.response = { __proto__: res, app: app };
app.init();
return app;
}



merge(exports, connect.middleware);



exports.createServer = deprecate.function(createApplication,
'createServer() is deprecated\n' +
'express applications no longer inherit from http.Server\n' +
'please use:\n' +
'\n' +
'  var express = require("express");\n' +
'  var app = express();\n' +
'\n'
);



exports.application = proto;
exports.request = req;
exports.response = res;



exports.Route = Route;
exports.Router = Router;



exports.errorHandler.title = 'Express';

