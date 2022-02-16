var fs = require('graceful-fs');
var path = require('path');
var deepExtend = require('deep-extend');
var createError = require('./util/createError');

function read(file, options, callback) {
if (typeof options === 'function') {
callback = options;
options = {};
}


fs.stat(file, function (err, stat) {
if (err) {
return callback(err);
}


if (stat.isDirectory()) {
return find(file, function (err, file) {
if (err) {
return callback(err);
}

read(file, options, callback);
});
}


fs.readFile(file, function (err, contents) {
var json;

if (err) {
return callback(err);
}

try {
json = JSON.parse(contents.toString());
} catch (err) {
err.file = path.resolve(file);
err.code = 'EMALFORMED';
return callback(err);
}


try {
json = parse(json, options);
} catch (err) {
err.file = path.resolve(file);
return callback(err);
