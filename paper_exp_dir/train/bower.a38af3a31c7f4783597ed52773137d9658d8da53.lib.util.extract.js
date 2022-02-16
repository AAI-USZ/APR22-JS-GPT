var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var unzip = require('unzip');
var tar = require('tar');
var Q = require('q');
var mout = require('mout');
var osJunk = require('./osJunk');



zlib.Z_DEFAULT_CHUNK = 1024 * 8;

var extractors,
extractorTypes,
osExtras;

extractors = {
'.zip': extractZip,
