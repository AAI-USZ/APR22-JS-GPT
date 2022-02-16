

var EventEmitter = require('events').EventEmitter;

var merge = require('merge-descriptors')
, mixin = require('utils-merge')

var proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')



exports = module.exports = createApplication;



function createApplication() {
var app = function(req, res, next) {
app.handle(req, res, next);
};

mixin(app, proto);
mixin(app, EventEmitter.prototype);
