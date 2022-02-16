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

