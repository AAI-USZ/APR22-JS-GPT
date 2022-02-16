var fs = require('fs')
var glob = require('glob')
var mm = require('minimatch')
var q = require('q')

var helper = require('./helper')
var log = require('./logger').create('watcher')

var createWinGlob = function (realGlob) {
return function (pattern, options, done) {
realGlob(pattern, options, function (err, results) {
done(err, results.map(helper.normalizeWinPath))
