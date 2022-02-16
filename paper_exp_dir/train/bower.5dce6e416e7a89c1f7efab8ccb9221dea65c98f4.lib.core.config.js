var path = require('path');
var fs = require('fs');
var mout = require('mout');
var mkdirp = require('mkdirp');


var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

