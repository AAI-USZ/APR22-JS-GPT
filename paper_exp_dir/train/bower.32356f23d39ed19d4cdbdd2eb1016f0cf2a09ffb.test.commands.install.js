var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var commands = helpers.require('lib/index').commands;

describe('bower install', function () {

var tempDir = new helpers.TempDir();

