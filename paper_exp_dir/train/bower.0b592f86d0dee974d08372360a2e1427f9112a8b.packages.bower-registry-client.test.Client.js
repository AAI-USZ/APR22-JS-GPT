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
