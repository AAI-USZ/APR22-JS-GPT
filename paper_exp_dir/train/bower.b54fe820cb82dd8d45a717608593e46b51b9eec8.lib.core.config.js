var path       = require('path');
var fs         = require('fs');
var _          = require('lodash');
var tmp        = require('tmp');
var mkdirp     = require('mkdirp');

var fileExists = require('../util/file-exists').sync;

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
