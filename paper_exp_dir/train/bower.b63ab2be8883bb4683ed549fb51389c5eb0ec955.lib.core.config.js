var path       = require('path');
var fs         = require('fs');
var _          = require('lodash');
var tmp        = require('tmp');

var fileExists = require('../util/file-exists').sync;

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

var home = (process.platform === 'win32'
? process.env.USERPROFILE
