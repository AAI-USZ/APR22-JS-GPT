var path = require('path');
var bowerJson = require('bower-json');
var Q = require('q');





function readJson(file, options) {
options = options || {};


return Q.nfcall(bowerJson.read, file, options)
.spread(function (json, jsonFile) {
var deprecated;

jsonFile = path.basename(jsonFile);
