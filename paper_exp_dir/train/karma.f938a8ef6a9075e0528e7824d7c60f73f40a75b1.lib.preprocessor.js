var fs = require('graceful-fs')
var crypto = require('crypto')
var mm = require('minimatch')
var isBinaryFile = require('isbinaryfile')

var log = require('./logger').create('preprocess')

var sha1 = function (data) {
var hash = crypto.createHash('sha1')
hash.update(data)
