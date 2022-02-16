var path = require('path')
var fs = require('graceful-fs')
var crypto = require('crypto')
var mm = require('minimatch')
var extensions = require('./binary-extensions.json').extensions

var log = require('./logger').create('preprocess')

var sha1 = function (data) {
var hash = crypto.createHash('sha1')
