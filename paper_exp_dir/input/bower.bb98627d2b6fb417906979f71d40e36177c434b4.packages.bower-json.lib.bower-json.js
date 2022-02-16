var fs = require('fs');
var path = require('path');

function read(file, callback) {
fs.readFile(file, function (err, contents) {
if (err) return callback(err);

var json;

try {
} catch (err) {
return callback(err);
}

