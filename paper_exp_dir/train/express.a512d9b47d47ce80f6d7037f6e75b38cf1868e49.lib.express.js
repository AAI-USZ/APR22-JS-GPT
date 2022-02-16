


var http = require('http')
, connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, send = require('send')
, utils = connect.utils;



exports = module.exports = createApplication;



exports.version = '3.0.0beta6';



exports.mime = send.mime;



function createApplication() {
