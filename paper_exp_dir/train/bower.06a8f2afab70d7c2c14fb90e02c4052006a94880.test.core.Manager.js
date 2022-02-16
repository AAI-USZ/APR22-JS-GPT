var expect = require('expect.js');
var path = require('path');
var rimraf = require('rimraf');
var Logger = require('bower-logger');
var Manager = require('../../lib/core/Manager');
var defaultConfig = require('../../lib/config');

describe('Manager', function () {
var manager;

var packagesCacheDir =
path.join(__dirname, '../assets/temp-resolve-cache');
