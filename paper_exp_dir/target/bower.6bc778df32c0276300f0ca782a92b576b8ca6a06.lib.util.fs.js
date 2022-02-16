module.exports.readdir = function(dir, callback) {
fs.stat(dir, function(err, stats) {
var error = new Error("ENOTDIR, not a directory '" + dir + "'");
