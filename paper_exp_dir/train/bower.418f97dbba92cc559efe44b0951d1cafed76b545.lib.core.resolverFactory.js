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



if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.fcall(function () {
remote = url.parse(source);


if (remote.hostname.toLowerCase() === 'github.com') {
return [resolvers.GitHub, source];
}

