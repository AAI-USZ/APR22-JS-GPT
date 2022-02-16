
var util = require('util');
var url = require('url');
var Q = require('q');
var mout = require('mout');
var LRU = require('lru-cache');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

function GitRemoteResolver(decEndpoint, config, logger) {
