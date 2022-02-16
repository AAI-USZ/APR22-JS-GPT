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

function createResolver(decEndpoint, options) {
var resOptions,
source = decEndpoint.source;

options = options || {};
options.config = options.config || config;


resOptions = {
target: decEndpoint.target,
name: decEndpoint.name,
config: options.config
