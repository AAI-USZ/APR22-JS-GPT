var child_process = require('child_process'),
spawn = child_process.spawn,
async = require('async'),
fs = require('fs'),
util = require('../lib/util'),
file = util.file,
coreDir = __dirname + '/../',
tmpDir = coreDir + 'tmp/';

var regex = {
