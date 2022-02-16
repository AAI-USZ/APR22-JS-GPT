var path = require('path');
var os = require('os');
var mout = require('mout');
var rc = require('rc');
var cli = require('./util/cli');


var temp = os.tmpdir ? os.tmpdir() : os.tmpDir();

var home = (process.platform === 'win32'
? process.env.USERPROFILE
: process.env.HOME) || temp;

var roaming = process.platform === 'win32'
? path.join(path.resolve(process.env.APPDATA || home || temp), 'bower_new')
