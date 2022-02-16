var RegistryClient = require('../Client'),
expect = require('chai').expect,
nock = require('nock');

describe('RegistryClient', function () {

beforeEach(function () {
this.uri = 'https://bower.herokuapp.com';
this.timeoutVal = 5000;
this.registry = new RegistryClient({
strictSsl: false
});
this.conf = {
search: [this.uri],
register: this.uri,
publish: this.uri
};
});

describe('Constructor', function () {

describe('instantiating a client without custom options', function () {

it('should provide an instance of RegistryClient', function () {
expect(this.registry instanceof RegistryClient).to.be.ok;
});

it('should set default registry config', function () {
expect(this.registry._config.registry).to.deep.equal(this.conf);
});

it('should set default search config', function () {
expect(this.registry._config.registry.search[0]).to.equal(this.uri);
});

it('should set default register config', function () {
expect(this.registry._config.registry.register).to.equal(this.uri);
});

it('should set default publish config', function () {
expect(this.registry._config.registry.publish).to.equal(this.uri);
