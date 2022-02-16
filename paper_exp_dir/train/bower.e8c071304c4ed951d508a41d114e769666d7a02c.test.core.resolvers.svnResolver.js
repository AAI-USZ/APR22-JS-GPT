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

describe('SvnResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
