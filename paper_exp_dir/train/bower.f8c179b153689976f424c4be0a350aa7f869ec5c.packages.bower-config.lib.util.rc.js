var path = require('path');
var fs = require('graceful-fs');
var optimist = require('optimist');
var osenv = require('osenv');
var object = require('mout/object');
var string = require('mout/string');
var paths = require('./paths');

var win = process.platform === 'win32';
var home = osenv.home();

function rc(name, defaults, cwd, argv) {
var argvConfig;

defaults = defaults || {};
cwd = cwd || process.cwd();
argv = argv || optimist.argv;

