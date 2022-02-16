var util = require('util');
var Q = require('q');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var path = require('path');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');
var cmd = require('../../util/cmd');

var hasSvn;


try {
which.sync('svn');
