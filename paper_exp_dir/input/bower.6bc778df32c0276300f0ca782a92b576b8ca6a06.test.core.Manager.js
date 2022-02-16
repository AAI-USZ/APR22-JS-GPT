var expect = require('expect.js');
var path = require('path');
var rimraf = require('../../lib/util/rimraf');
var Logger = require('bower-logger');
var Manager = require('../../lib/core/Manager');
var defaultConfig = require('../../lib/config');

var manager;

