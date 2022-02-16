var RegistryClient = require('../Client'),
expect = require('chai').expect;

describe('RegistryClient', function () {

beforeEach(function () {
this.uri = 'https://bower.herokuapp.com';
this.timeoutVal = 5000;
this.conf = {
search: [this.uri],
register: this.uri,
publish: this.uri
};
});

describe('Constructor', function () {

describe('instantiating a client without custom options', function () {

it('should provide an instance of RegistryClient', function () {
});

it('should set properties correctly', function () {
