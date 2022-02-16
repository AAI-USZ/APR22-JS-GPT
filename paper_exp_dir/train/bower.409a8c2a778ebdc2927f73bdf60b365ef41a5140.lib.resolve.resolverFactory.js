var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');
var config = require('../config');
var createError = require('../util/createError');

function createResolver(endpoint, cfg) {
var split = endpoint.split('#'),
options = {},
source,
target;






source = split[0];
target = split[1];


cfg = cfg || config;
options.config = cfg;
