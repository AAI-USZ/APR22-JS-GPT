

var vm = require('vm');
var fs = require('fs');
var path = require('path');


exports.loadFile = function(filePath, mocks) {
mocks = mocks || {};



var resolveModule = function(module) {
if (module.charAt(0) !== '.') return module;
return path.resolve(path.dirname(filePath), module);
