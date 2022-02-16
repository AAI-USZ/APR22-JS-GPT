var Q = require('q');
var path = require('path');
var fs = require('fs');
var object = require('mout/object');

var semver = require('../../util/semver');
var createError = require('../../util/createError');
var readJson = require('../../util/readJson');
var removeIgnores = require('../../util/removeIgnores');

function pluginResolverFactory(resolverFactory, options) {
options = options || {};

