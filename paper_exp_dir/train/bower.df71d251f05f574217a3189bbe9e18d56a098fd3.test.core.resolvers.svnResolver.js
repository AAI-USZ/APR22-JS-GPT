var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var SvnResolver = require('../../../lib/core/resolvers/SvnResolver');
var defaultConfig = require('../../../lib/config');
var helpers = require('../../helpers');

if (!helpers.hasSvn()) describe.skip('SvnResolver', function() {});
else describe('SvnResolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-svn/repo');
var testPackageAdmin = path.resolve(__dirname, '../../assets/package-svn/admin');
var originaltags = SvnResolver.tags;
var logger;

