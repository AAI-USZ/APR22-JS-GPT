var Q = require('q');
var path = require('path');
var fs = require('graceful-fs');
var cli = require('../util/cli');
var createError = require('../util/createError');

function help(logger, name) {
var json;

if (name) {
json = path.resolve(__dirname, '../../templates/json/help-' + name.replace(/\s+/g, '/') + '.json');
} else {
json = path.resolve(__dirname, '../../templates/json/help.json');
}
