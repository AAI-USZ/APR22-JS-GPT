var RegistryClient = require('../Client');
var fs = require('fs');
var expect = require('expect.js');
var md5 = require('../lib/util/md5');
var nock = require('nock');
var http = require('http');
var Config = require('bower-config');

describe('RegistryClient', function () {
beforeEach(function () {
this.uri = 'https://bower.herokuapp.com';
this.timeoutVal = 5000;
this.registry = new RegistryClient(Config.read(process.cwd(), {
strictSsl: false,
timeout: this.timeoutVal
}));
