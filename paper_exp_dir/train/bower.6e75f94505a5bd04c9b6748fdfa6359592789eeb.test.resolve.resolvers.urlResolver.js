var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/resolve/resolvers/UrlResolver');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package'),
tempDir = path.resolve(__dirname, '../../assets/tmp');

before(function (next) {

cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function () {

nock.cleanAll();
});

describe('.constructor', function () {
