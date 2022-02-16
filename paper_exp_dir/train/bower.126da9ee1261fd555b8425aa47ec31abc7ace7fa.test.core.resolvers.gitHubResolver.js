var path = require('path');
var nock = require('nock');
var fs = require('graceful-fs');
var expect = require('expect.js');
var Logger = require('bower-logger');
var GitRemoteResolver  = require('../../../lib/core/resolvers/GitRemoteResolver');
var GitHubResolver = require('../../../lib/core/resolvers/GitHubResolver');
var defaultConfig = require('../../../lib/config');

describe('GitHub', function () {
var logger;
var testPackage = path.resolve(__dirname, '../../assets/package-a');

before(function () {
logger = new Logger();
});

afterEach(function () {

nock.cleanAll();

logger.removeAllListeners();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitHubResolver(decEndpoint, defaultConfig({ strictSsl: false }), logger);
}

describe('.constructor', function () {
it.skip('should throw an error on invalid GitHub URLs');

it('should ensure .git in the source', function () {
var resolver;

resolver = create('git://github.com/twitter/bower');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = create('git://github.com/twitter/bower.git');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = create('git://github.com/twitter/bower.git/');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');
});
});

describe('.resolve', function () {
it('should download and extract the .tar.gz archive from GitHub.com', function (next) {
var resolver;

nock('https://github.com')
.get('/IndigoUnited/events-emitter/archive/0.1.0.tar.gz')
.replyWithFile(200, path.resolve(__dirname, '../../assets/package-tar.tar.gz'));

resolver = create({ source: 'git://github.com/IndigoUnited/events-emitter.git', target: '0.1.0' });

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, '.bower.json'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar.js'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'package-tar.tar.gz'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'package-tar.tar'))).to.be(false);
next();
})
.done();
});

it('should retry using the GitRemoteResolver mechanism if download failed', function (next) {
this.timeout(20000);

var resolver;
var retried;

nock('https://github.com')
.get('/IndigoUnited/events-emitter/archive/0.1.0.tar.gz')
.reply(200, 'this is not a valid tar');

logger.on('log', function (entry) {
