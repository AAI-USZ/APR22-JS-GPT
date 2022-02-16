

var EventEmitter = require('events').EventEmitter;
var mixin = require('utils-merge');
var proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response');



exports = module.exports = createApplication;
