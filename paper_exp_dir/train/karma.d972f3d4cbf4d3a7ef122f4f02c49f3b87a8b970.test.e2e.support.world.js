var fs = require('fs')
var vm = require('vm')
var path = require('path')
var hasher = require('crypto').createHash
var mkdirp = require('mkdirp')
var _ = require('lodash')

exports.World = function World () {
this.template = _.template('module.exports = function (config) {\n  config.set(\n    <%= content %>\n  );\n};')

this.configFile = {
singleRun: true,
reporters: ['dots'],
frameworks: ['jasmine'],
basePath: __dirname,
colors: false,
__dirname: __dirname,
_resolve: function (name) {
return path.resolve(__dirname, '..', 'support', name)
}
}

this.addConfigContent = (function (_this) {
return function (content) {
if (content == null) {
content = ''
