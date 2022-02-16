var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var util = require('util');
var rimraf = require('rimraf');
var tmp = require('tmp');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');
var Resolver = require('../../lib/resolve/Resolver');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../assets/tmp'),
testPackage = path.resolve(__dirname, '../assets/github-test-package');

describe('.getSource', function () {
it('should return the resolver source', function () {
var resolver = new Resolver('foo');
