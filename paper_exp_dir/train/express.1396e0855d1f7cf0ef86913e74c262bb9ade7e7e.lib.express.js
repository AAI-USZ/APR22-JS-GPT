

var EventEmitter = require('events').EventEmitter;

var merge = require('merge-descriptors')
, mixin = require('utils-merge')

var proto = require('./application')
, Route = require('./router/route')
, Router = require('./router')
, req = require('./request')
, res = require('./response')


require('./patch')
