var RegistryClient = require('../Client'),
fs = require('fs'),
expect = require('expect.js'),
nock = require('nock');

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
