var Q = require('q');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var url = require('url');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function getConstructor(source, config, registryClient) {
var resolvedPath;
var remote;
var resolvedSource = source;



