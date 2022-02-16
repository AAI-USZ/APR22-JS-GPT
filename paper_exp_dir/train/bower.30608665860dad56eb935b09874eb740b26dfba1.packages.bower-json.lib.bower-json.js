var fs = require('fs');
var path = require('path');

function read(file, callback) {
fs.readFile(file, function (err, contents) {
if (err) return callback(err);

var json;

try {
json = JSON.parse(contents);
} catch (err) {
err.code = 'ESYNTAX';
return callback(err);
}

callback(null, parse(json));
});
}

function parse(json) {
