var Q = require('q');
var path = require('path');
var fs = require('../../util/fs');
var object = require('mout/object');

var semver = require('../../util/semver');
var createError = require('../../util/createError');
var readJson = require('../../util/readJson');
var removeIgnores = require('../../util/removeIgnores');

function pluginResolverFactory(resolverFactory, bower) {
bower = bower || {};

if (typeof resolverFactory !== 'function') {
throw createError(
'Resolver has "' +
typeof resolverFactory +
'" type instead of "function" type.',
'ERESOLERAPI'
);
}

var resolver = resolverFactory(bower);

function maxSatisfyingVersion(versions, target) {
var versionsArr, index;
