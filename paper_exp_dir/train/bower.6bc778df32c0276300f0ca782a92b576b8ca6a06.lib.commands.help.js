var Q = require('q');
var path = require('path');
var fs = require('../util/fs');
var createError = require('../util/createError');

function help(logger, name, config) {
var json;

if (name) {
json = path.resolve(
__dirname,
'../templates/json/help-' + name.replace(/\s+/g, '/') + '.json'
);
} else {
json = path.resolve(__dirname, '../templates/json/help.json');
}

return Q.promise(function(resolve) {
fs.exists(json, resolve);
