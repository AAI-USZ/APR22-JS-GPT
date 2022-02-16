


var http = require('http')
, connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0beta2';



exports.mime = connect.mime;



function createApplication() {
var app = connect();
utils.merge(app, proto);
app.request = { __proto__: req };
app.response = { __proto__: res };
app.init();
