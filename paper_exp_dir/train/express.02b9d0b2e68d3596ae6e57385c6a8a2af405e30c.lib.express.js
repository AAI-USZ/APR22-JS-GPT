

var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0rc5';



exports.mime = connect.mime;



function createApplication() {
var app = connect();
