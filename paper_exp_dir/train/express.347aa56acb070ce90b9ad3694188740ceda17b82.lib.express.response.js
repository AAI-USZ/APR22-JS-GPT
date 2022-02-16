




var fs = require('fs')
, http = require('http')
, path = require('path')
, pump = require('sys').pump
, utils = require('connect/utils')
, mime = require('connect/utils').mime
, parseRange = require('./utils').parseRange;



var multiple = ['Set-Cookie'];

