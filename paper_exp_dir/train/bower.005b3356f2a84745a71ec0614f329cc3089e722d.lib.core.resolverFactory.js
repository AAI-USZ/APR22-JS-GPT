var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function createResolver(decEndpoint, registryClient, config) {
var resOptions;
var source = decEndpoint.source;
var resolvedPath;

config = config || defaultConfig;


resOptions = {
target: decEndpoint.target,
name: decEndpoint.name,
config: config
};



if (/^git(\+(ssh|https?))?:\/\
