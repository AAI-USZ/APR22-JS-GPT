var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var config = require('../../lib/config');
var resolverFactory = require('../../lib/resolve/resolverFactory');
var FsResolver = require('../../lib/resolve/resolvers/FsResolver');
var GitFsResolver = require('../../lib/resolve/resolvers/GitFsResolver');
var GitRemoteResolver = require('../../lib/resolve/resolvers/GitRemoteResolver');
var UrlResolver = require('../../lib/resolve/resolvers/UrlResolver');

describe('resolverFactory', function () {
var tempSource;

