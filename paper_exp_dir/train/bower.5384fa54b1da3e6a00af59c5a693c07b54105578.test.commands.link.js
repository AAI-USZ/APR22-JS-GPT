var path = require('path');
var expect = require('expect.js');
var helpers = require('../helpers');

var link = helpers.command('link');

describe('bower link', function () {

var mainPackage = new helpers.TempDir({
'bower.json': {
