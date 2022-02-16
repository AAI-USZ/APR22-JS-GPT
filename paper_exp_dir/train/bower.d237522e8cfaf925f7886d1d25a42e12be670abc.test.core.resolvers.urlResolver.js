var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var path = require('path');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');
var defaultConfig = require('../../../lib/config');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var logger;

before(function (next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function () {
logger.removeAllListeners();


nock.cleanAll();
});

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new UrlResolver(decEndpoint, config || defaultConfig, logger);
}

describe('.constructor', function () {
it('should guess the name from the URL', function () {
var resolver = create('http://bower.io/foo.txt');

expect(resolver.getName()).to.equal('foo.txt');
});

it('should remove ?part from the URL when guessing the name', function () {
var resolver = create('http://bower.io/foo.txt?bar');

expect(resolver.getName()).to.equal('foo.txt');
});

it('should not guess the name or remove ?part from the URL if not guessing', function () {
var resolver = create({ source: 'http://bower.io/foo.txt?bar', name: 'baz' });

expect(resolver.getName()).to.equal('baz');
});

it('should error out if a target was specified', function (next) {
var resolver;

try {
resolver = create({ source: testPackage, target: '0.0.1' });
} catch (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/can\'t resolve targets/i);
expect(err.code).to.equal('ENORESTARGET');
return next();
}

next(new Error('Should have thrown'));
});
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

afterEach(function (next) {
rimraf(path.join(tempDir, '.bower.json'), next);
});

after(function (next) {
rimraf(tempDir, next);
});

it('should resolve to true if the response is not in the 2xx range', function (next) {
var resolver = create('http:

nock('http://bower.io')
.head('/foo.js')
.reply(500);

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0'
}));

resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should resolve to true if cache headers changed', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.reply(200, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': 'fk3454fdmmlw20i9nf',
'Last-Modified': 'Tue, 16 Nov 2012 13:35:29 GMT'
}
}));

resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should resolve to false if cache headers haven\'t changed', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.reply(200, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
}
}));

resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should resolve to true if server responds with 304 (ETag mechanism)', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.matchHeader('If-None-Match', '686897696a7c876b7e')
.reply(304, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
}
}));

resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should work with redirects', function (next) {
var redirectingUrl = 'http://redirecting-url.com';
var redirectingToUrl = 'http://bower.io';
var resolver;

nock(redirectingUrl)
.head('/foo.js')
.reply(302, '', { location: redirectingToUrl + '/foo.js' });

nock(redirectingToUrl)
.head('/foo.js')
.reply(200, 'foo contents', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});


fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
}
}));

resolver = create(redirectingUrl + '/foo.js');

resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});
});

describe('.resolve', function () {



function assertMain(dir, singleFile) {
return Q.nfcall(fs.readFile, path.join(dir, '.bower.json'))
.then(function (contents) {
var pkgMeta = JSON.parse(contents.toString());

expect(pkgMeta.main).to.equal(singleFile);

return pkgMeta;
});
}

it('should download file, renaming it to index', function (next) {
var resolver;

nock('http://bower.io')
.get('/foo.js')
.reply(200, 'foo contents');

resolver = create('http://bower.io/foo.js');

resolver.resolve()
.then(function (dir) {
var contents;

expect(fs.existsSync(path.join(dir, 'index.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(false);

contents = fs.readFileSync(path.join(dir, 'index.js')).toString();
expect(contents).to.equal('foo contents');

assertMain(dir, 'index.js')
.then(next.bind(next, null));
})
.done();
});

it('should extract if source is an archive', function (next) {
var resolver;

nock('http://bower.io')
.get('/package-zip.zip')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-zip.zip'));

resolver = create('http://bower.io/package-zip.zip');

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-zip.zip'))).to.be(false);
next();
})
.done();
});

it('should extract if source is an archive (case insensitive)', function (next) {
var resolver;

nock('http://bower.io')
.get('/package-zip.ZIP')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-zip.zip'));

resolver = create('http://bower.io/package-zip.ZIP');

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-zip.ZIP'))).to.be(false);
next();
})
.done();
});

it('should copy extracted folder contents if archive contains only a folder inside', function (next) {
var resolver;

nock('http://bower.io')
.get('/package-zip-folder.zip')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-zip-folder.zip'));

nock('http://bower.io')
.get('/package-zip.zip')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-zip-folder.zip'));

resolver = create('http://bower.io/package-zip-folder.zip');

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-zip'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-zip-folder'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-zip-folder.zip'))).to.be(false);

resolver = create({ source: 'http://bower.io/package-zip.zip', name: 'package-zip' });

return resolver.resolve();
})
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-zip'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-zip.zip'))).to.be(false);

next();
})
.done();
});

it('should extract if source is an archive and rename to index if it\'s only one file inside', function (next) {
var resolver;

nock('http://bower.io')
.get('/package-zip-single-file.zip')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-zip-single-file.zip'));

resolver = create('http://bower.io/package-zip-single-file.zip');

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'index.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-zip'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-zip-single-file'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-zip-single-file.zip'))).to.be(false);

return assertMain(dir, 'index.js')
.then(next.bind(next, null));
})
.done();
});

it('should extract if source is an archive and not rename to index if inside it\'s just a just bower.json/component.json file in it', function (next) {
var resolver;

