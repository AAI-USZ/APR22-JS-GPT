var path = require('path');
var fs = require('fs');
var mout = require('mout');
var mkdirp = require('mkdirp');
var rc = require('rc');


var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

var home = (process.platform === 'win32'
? process.env.USERPROFILE
: process.env.HOME) || temp;
