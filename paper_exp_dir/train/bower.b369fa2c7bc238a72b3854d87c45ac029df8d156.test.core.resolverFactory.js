var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var defaultConfig = require('../../lib/config');
var resolverFactory = require('../../lib/core/resolverFactory');
var FsResolver = require('../../lib/core/resolvers/FsResolver');
var GitFsResolver = require('../../lib/core/resolvers/GitFsResolver');
var GitRemoteResolver = require('../../lib/core/resolvers/GitRemoteResolver');
var UrlResolver = require('../../lib/core/resolvers/UrlResolver');

describe('resolverFactory', function () {
var tempSource;
