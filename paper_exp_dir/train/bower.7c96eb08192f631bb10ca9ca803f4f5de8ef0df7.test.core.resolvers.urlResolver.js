var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
var tempDir = path.resolve(__dirname, '../../assets/tmp');

before(function (next) {

