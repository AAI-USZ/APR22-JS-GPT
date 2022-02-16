var path = require('path');
var expect = require('expect.js');
var helpers = require('../helpers');

describe('bower install', function () {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', { cwd: tempDir.path });

