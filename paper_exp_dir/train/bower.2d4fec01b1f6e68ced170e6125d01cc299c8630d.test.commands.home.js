var Q = require('q');
var expect = require('expect.js');
var helpers = require('../helpers');

describe('bower home', function () {

var package = new helpers.TempDir({
'bower.json': {
name: 'package',
homepage: 'http://bower.io'
