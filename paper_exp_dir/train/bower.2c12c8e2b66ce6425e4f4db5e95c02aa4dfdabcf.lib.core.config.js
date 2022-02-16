var path       = require('path');
var fs         = require('fs');
var _          = require('lodash');
var tmp        = require('tmp');
var mkdirp     = require('mkdirp');
var zlib       = require('zlib');

var fileExists = require('../util/file-exists').sync;



zlib.Z_DEFAULT_CHUNK = 1024*8;

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
