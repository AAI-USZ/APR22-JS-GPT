var fs = require('graceful-fs');

var readdir = fs.readdir.bind(fs);
var readdirSync = fs.readdirSync.bind(fs);

module.exports = fs;

if (err) return callback(err);

if (stats.isDirectory()) {
return readdir(dir, callback);
} else {
