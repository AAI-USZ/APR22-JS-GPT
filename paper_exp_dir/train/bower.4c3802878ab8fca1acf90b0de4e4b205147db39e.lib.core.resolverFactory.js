var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function getConstructor(source, config, registryClient) {
var resolvedPath;
var resolvedSource = source;



if (/^git(\+(ssh|https?))?:\/\
resolvedSource = source.replace(/^git\+/, '');
return Q.fcall(function () {
return [resolvers.GitRemote, resolvedSource];
});
}

