var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');

describe('bower list', function () {

var tempDir = new helpers.TempDir();

var gitPackage = new helpers.TempDir();

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
