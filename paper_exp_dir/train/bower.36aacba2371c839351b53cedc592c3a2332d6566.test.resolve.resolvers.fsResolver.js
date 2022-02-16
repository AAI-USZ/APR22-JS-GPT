var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/resolve/resolvers/FsResolver');

describe('FsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package'),
tempSource;

before(function (next) {


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function (next) {
if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new FsResolver(testPackage);

expect(resolver.getName()).to.equal('github-test-package');
});

it('should make paths absolute and normalized', function () {
var resolver;

resolver = new FsResolver(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = new FsResolver(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});
});

describe('.hasNew', function () {
it('should resolve always to true (for now..)', function (next) {
var resolver = new FsResolver(path.relative(process.cwd(), testPackage));

resolver.hasNew()
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});
