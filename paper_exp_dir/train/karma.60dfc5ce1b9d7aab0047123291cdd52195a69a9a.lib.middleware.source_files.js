var querystring = require('querystring')
var _ = require('lodash')

var common = require('./common')
var logger = require('../logger')
var log = logger.create('middleware:source-files')


var findByPath = function (files, path) {
return _.find(Array.from(files), function (file) {
return file.path === path
