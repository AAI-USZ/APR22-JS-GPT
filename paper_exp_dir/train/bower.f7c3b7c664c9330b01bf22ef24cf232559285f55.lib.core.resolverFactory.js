var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function createResolver(decEndpoint, options) {
var resOptions;
var source = decEndpoint.source;
var resolvedPath;

options = options || {};
