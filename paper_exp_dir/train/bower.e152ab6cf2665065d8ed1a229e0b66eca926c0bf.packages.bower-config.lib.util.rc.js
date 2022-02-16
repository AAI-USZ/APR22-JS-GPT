var path = require('path');
var fs = require('graceful-fs');
var optimist = require('optimist');
var osenv = require('osenv');
var mout = require('mout');
var rimraf = require('rimraf');
var paths = require('./paths');

var win = process.platform === 'win32';
var home = osenv.home();

