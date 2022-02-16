var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Q = require('q');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/resolve/resolvers/FsResolver');

describe('FsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package'),
tempSource;

before(function (next) {
