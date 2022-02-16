
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var coffee = require('coffee-script');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var normalizeConfig = function(config) {

var basePathResolve = function(relativePath) {
if (util.isUrlAbsolute(relativePath)) {
return relativePath;
}

return path.resolve(config.basePath, relativePath);
};

config.files = config.files.map(basePathResolve);
config.exclude = config.exclude.map(basePathResolve);
