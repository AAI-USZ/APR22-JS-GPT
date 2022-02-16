var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function () {

var tempDir = new helpers.TempDir();

var gitPackage = new helpers.TempDir();
