var RegistryClient = require('../Client');
var fs = require('fs');
var expect = require('expect.js');
var md5 = require('../lib/util/md5');
var nock = require('nock');
var http = require('http');

describe('RegistryClient', function () {
beforeEach(function () {
this.uri = 'https://bower.herokuapp.com';
this.timeoutVal = 5000;
this.registry = new RegistryClient({
strictSsl: false,
timeout: this.timeoutVal
});
this.conf = {
search: [this.uri],
register: this.uri,
publish: this.uri
};
});

describe('Constructor', function () {
describe('instantiating a client', function () {
it('should provide an instance of RegistryClient', function () {
expect(this.registry instanceof RegistryClient).to.be.ok;
});

it('should set default registry config', function () {
expect(this.registry._config.registry).to.eql(this.conf);
});

it('should set default search config', function () {
expect(this.registry._config.registry.search[0]).to.eql(this.uri);
});

it('should set default register config', function () {
expect(this.registry._config.registry.register).to.eql(this.uri);
});

it('should set default publish config', function () {
expect(this.registry._config.registry.publish).to.eql(this.uri);
});

it('should set default cache path config', function () {
expect(typeof this.registry._config.cache === 'string').to.be.ok;
});

it('should set default timeout config', function () {
expect(this.registry._config.timeout).to.eql(this.timeoutVal);
});

it('should set default strictSsl config', function () {
expect(this.registry._config.strictSsl).to.be(false);
});
});

it('should have a lookup prototype method', function () {
expect(RegistryClient.prototype).to.have.property('lookup');
});

it('should have a search prototype method', function () {
expect(RegistryClient.prototype).to.have.property('search');
});

it('should have a list prototype method', function () {
expect(RegistryClient.prototype).to.have.property('list');
});

it('should have a register prototype method', function () {
expect(RegistryClient.prototype).to.have.property('register');
});

it('should have a clearCache prototype method', function () {
expect(RegistryClient.prototype).to.have.property('clearCache');
});

it('should have a resetCache prototype method', function () {
expect(RegistryClient.prototype).to.have.property('resetCache');
});

it('should have a clearRuntimeCache static method', function () {
expect(RegistryClient).to.have.property('clearRuntimeCache');
});
});

describe('instantiating a client with custom options', function () {
describe('offline', function () {
it('should not return search results if cache is empty', function (next) {

this.registry.clearCache(function () {
this.registry._config.offline = true;
this.registry.search('jquery', function (err, results) {
expect(err).to.be(null);
expect(results.length).to.eql(0);
next();
});
}.bind(this));
});
});

describe('cache', function () {
beforeEach(function () {
nock('https://bower.herokuapp.com:443')
.get('/packages/search/jquery')
.replyWithFile(200, __dirname + '/fixtures/search.json');

this.client = new RegistryClient({
cache: __dirname + '/cache',
strictSsl: false
});

this.cacheDir = this.client._config.cache;
this.host = 'bower.herokuapp.com';
this.method = 'search';
this.pkg = 'jquery';

this.path = this.cacheDir + '/' + this.host + '/' + this.method + '/' + this.pkg + '_' + md5(this.pkg).substr(0, 5);
});

afterEach(function (next) {
this.client.clearCache(next);
});

it('should fill cache', function (next) {
var self = this;


self.client.search(self.pkg, function (err, results) {
expect(err).to.be(null);
expect(results.length).to.eql(334);


fs.exists(self.path, function (exists) {
expect(exists).to.be(true);
next();
});
});

});

it('should read results from cache', function (next) {
var self = this;

self.client.search(self.pkg, function (err, results) {
expect(err).to.be(null);
expect(results.length).to.eql(334);

fs.exists(self.path, function (exists) {
expect(exists).to.be(true);
next();
});
});
});
});
});





describe('calling the lookup instance method with argument', function () {
beforeEach(function () {
nock('https://bower.herokuapp.com:443')
.get('/packages/jquery')
.reply(200, {
name: 'jquery',
url: 'git://github.com/components/jquery.git'
});

this.registry._config.force = true;
});

it('should not return an error', function (next) {
this.registry.lookup('jquery', function (err) {
expect(err).to.be(null);
next();
});
});

it('should return entry type', function (next) {
this.registry.lookup('jquery', function (err, entry) {
expect(err).to.be(null);
expect(entry.type).to.eql('alias');
next();
});
});

it('should return entry url ', function (next) {
this.registry.lookup('jquery', function (err, entry) {
expect(err).to.be(null);
expect(entry.url).to.eql('git://github.com/components/jquery.git');
});
next();
});
});

describe('calling the lookup instance method without argument', function () {
it('should return no result', function (next) {
this.registry.lookup('', function (err, entry) {
expect(err).to.not.be.ok();
expect(entry).to.not.be.ok();
next();
});
});
});

