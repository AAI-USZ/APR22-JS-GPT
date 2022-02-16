var rimraf = require('rimraf');
var chmodr = require('chmodr');
var fs = require('./fs');

module.exports = function (dir, callback) {
fs.lstat(dir, function (err, stats) {
if (err) {
if (err.code === 'ENOENT') return callback();
}

chmodr(dir, 0777, function (err) {
