var Q = require('q');
var path = require('path');
var fs = require('fs');

var semver = require('../../util/semver');
var createError = require('../../util/createError');
var readJson = require('../../util/readJson');
var removeIgnores = require('../../util/removeIgnores');

function pluginResolverFactory(pluginFactory, options) {
options = options || {};

if (typeof pluginFactory !== 'function') {
