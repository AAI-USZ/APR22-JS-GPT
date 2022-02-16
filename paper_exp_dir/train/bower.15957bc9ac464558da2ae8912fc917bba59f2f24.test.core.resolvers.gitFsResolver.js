var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var path = require('path');
var rimraf = require('rimraf');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var GitFsResolver = require('../../../lib/core/resolvers/GitFsResolver');
var defaultConfig = require('../../../lib/config');

describe('GitFsResolver', function () {
var tempSource;
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function () {
logger = new Logger();
});

afterEach(function (next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

function clearResolverRuntimeCache() {
GitFsResolver.clearRuntimeCache();
}

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitFsResolver(decEndpoint, config || defaultConfig, logger);
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = create(testPackage);

expect(resolver.getName()).to.equal('package-a');
});

it('should not guess the name from the path if the name was specified', function () {
var resolver = create({ source: testPackage, name: 'foo' });

expect(resolver.getName()).to.equal('foo');
});

it('should make paths absolute and normalized', function () {
var resolver;

resolver = create(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = create(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});

it.skip('should use config.cwd for resolving relative paths');
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = create({ source: testPackage, target: 'some-branch' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);
var fooContents;

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
var resolver = create({ source: testPackage, target: '~0.0.1' });

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
var resolver = create({ source: testPackage, target: 'bdf51ece75e20cf404e49286727b7e92d33e9ad0' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.not.contain('foo');
expect(files).to.not.contain('bar');
expect(files).to.not.contain('baz');
expect(files).to.contain('.master');
next();
})
.done();
});

it('should remove any untracked files and directories', function (next) {
var resolver = create({ source: testPackage, target: 'bdf51ece75e20cf404e49286727b7e92d33e9ad0' });
var file = path.join(testPackage, 'new-file');
var dir = path.join(testPackage, 'new-dir');

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
.fail(cleanup)
.done();
});

it('should leave the original repository untouched', function (next) {

cmd('git', ['checkout', 'master'], { cwd: testPackage })

.then(function () {
var resolver = create({ source: testPackage, target: 'some-branch' });
return resolver.resolve();
})

.then(function () {
return cmd('git', ['branch', '--color=never'], { cwd: testPackage })
.spread(function (stdout) {
expect(stdout).to.contain('* master');
});
})

.then(function () {
return cmd('git', ['status', '--porcelain'], { cwd: testPackage })
.spread(function (stdout) {
stdout = stdout.trim();
expect(stdout).to.equal('');
next();
});
})
.done();
});

it('should copy source folder permissions', function (next) {
var mode0777;
var resolver;

tempSource = path.resolve(__dirname, '../../assets/package-a-copy');
resolver = create({ source: tempSource, target: 'some-branch' });

copy.copyDir(testPackage, tempSource)
.then(function () {

fs.chmodSync(tempSource, 0777);

mode0777 = fs.statSync(tempSource).mode;
})
.then(resolver.resolve.bind(resolver))
.then(function (dir) {

var stat = fs.statSync(dir);
expect(stat.mode).to.equal(mode0777);
next();
})
.done();
});
});

describe('#refs', function () {
afterEach(clearResolverRuntimeCache);

it('should resolve to the references of the local repository', function (next) {
GitFsResolver.refs(testPackage)
.then(function (refs) {

refs = refs.slice(1, 8);

expect(refs).to.eql([
'e4655d250f2a3f64ef2d712f25dafa60652bb93e refs/heads/some-branch',
'0a7daf646d4fd743b6ef701d63bdbe20eee422de refs/tags/0.0.1',
'0791865e6f4b88f69fc35167a09a6f0626627765 refs/tags/0.0.2',
'2af02ac6ddeaac1c2f4bead8d6287ce54269c039 refs/tags/0.1.0',
