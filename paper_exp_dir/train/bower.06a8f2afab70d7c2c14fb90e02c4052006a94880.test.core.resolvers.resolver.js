var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var util = require('util');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var defaultConfig = require('../../../lib/config');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;
var dirMode0777;
var config = defaultConfig();

before(function () {
var stat;

mkdirp.sync(tempDir);
stat = fs.statSync(tempDir);
dirMode0777 = stat.mode;
rimraf.sync(tempDir);

