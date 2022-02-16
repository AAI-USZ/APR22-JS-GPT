

var merge = require('merge-descriptors');
var connect = require('connect')
, proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')
, deprecate = require('./utils').deprecate
, utils = connect.utils;



exports = module.exports = createApplication;



exports.mime = connect.mime;



function createApplication() {
var app = connect();
utils.merge(app, proto);
