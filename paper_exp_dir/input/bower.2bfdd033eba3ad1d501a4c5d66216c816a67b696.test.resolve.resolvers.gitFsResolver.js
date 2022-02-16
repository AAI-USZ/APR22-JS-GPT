var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var cmd = require('../../../lib/util/cmd');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
delete GitFsResolver._versions;
delete GitFsResolver._heads;
delete GitFsResolver._refs;
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new GitFsResolver(testPackage);

expect(resolver.getName()).to.equal('github-test-package');
});

it('should make paths absolute and normalized', function () {
var resolver = new GitFsResolver(path.relative(process.cwd(), testPackage));

expect(resolver.getSource()).to.equal(testPackage);

resolver = new GitFsResolver(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = new GitFsResolver(testPackage, { target: 'some-branch' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir),
fooContents;

expect(files).to.contain('foo');
expect(files).to.contain('baz');
expect(files).to.contain('baz');

fooContents = fs.readFileSync(path.join(dir, 'foo')).toString();
expect(fooContents).to.equal('foo foo');

next();
})
.done();
});

it('should checkout correctly if resolution is a tag', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '~0.0.1' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.contain('foo');
expect(files).to.contain('bar');
expect(files).to.not.contain('baz');

next();
})
.done();
});

it('should checkout correctly if resolution is a commit', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '7339c38f5874129504b83650fbb2d850394573e9' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.not.contain('foo');
expect(files).to.not.contain('bar');
expect(files).to.not.contain('baz');
expect(files).to.contain('README.md');
next();
})
.done();
});

it('should remove any untracked files and directories', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '7339c38f5874129504b83650fbb2d850394573e9' }),
file = path.join(testPackage, 'new-file'),
dir = path.join(testPackage, 'new-dir');

fs.writeFileSync(file, 'foo');
fs.mkdir(dir);

function cleanup(err) {
fs.unlinkSync(file);
fs.rmdirSync(dir);

if (err) {
throw err;
}
}

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.not.contain('new-file');
expect(files).to.not.contain('new-dir');

cleanup();
next();
})
.then(null, cleanup)
.done();
});

it('should leave the original repository untouched', function (next) {

cmd('git', ['checkout', 'master'], { cwd: testPackage })

.then(function () {
var resolver = new GitFsResolver(testPackage, { target: 'some-branch' });
return resolver.resolve();
})

.then(function () {
return cmd('git', ['branch', '--color=never'], { cwd: testPackage })
.then(function (stdout) {
expect(stdout).to.contain('* master');
});
})

.then(function () {
return cmd('git', ['status', '--porcelain'], { cwd: testPackage })
.then(function (stdout) {
stdout = stdout.trim();
expect(stdout).to.equal('');
next();
});
})
.done();
});

it('should copy source folder permissions', function (next) {


