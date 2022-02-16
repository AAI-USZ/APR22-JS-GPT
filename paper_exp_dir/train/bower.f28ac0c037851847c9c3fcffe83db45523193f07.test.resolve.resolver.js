var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = require('tmp');
var cmd = require('../../lib/util/cmd');
var Resolver = require('../../lib/resolve/Resolver');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../assets/tmp');

describe('.getSource', function () {
it('should return the resolver source', function () {
var resolver = new Resolver('foo');

expect(resolver.getSource()).to.equal('foo');
});
});

