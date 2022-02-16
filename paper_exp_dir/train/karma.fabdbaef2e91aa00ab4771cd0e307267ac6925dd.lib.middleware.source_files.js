

var from = require('core-js/library/fn/array/from')
var querystring = require('querystring')
var common = require('./common')
var _ = require('../helper')._


var findByPath = function (files, path) {
return _.find(from(files), function (file) {
return file.path === path
})
