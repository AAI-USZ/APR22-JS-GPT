




var extname = require('path').extname
, dirname = require('path').dirname
, basename = require('path').basename
, utils = require('connect').utils
, clone = require('./utils').clone
, merge = utils.merge
, http = require('http')
, fs = require('fs')
, mime = utils.mime;



var cache = {};



var viewCache = {};


