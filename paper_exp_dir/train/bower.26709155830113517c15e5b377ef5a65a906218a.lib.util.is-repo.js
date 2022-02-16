







var fs         = require('fs');
var path       = require('path');
var fileExists = require('./file-exists');



module.exports = function (dir, callback) {
fileExists(path.join(dir, '.git'), function (exists) {
if (!exists) return callback(false);
fs.lstat(dir, function (err, stat) {
if (err) return callback(false);
callback(!stat.isSymbolicLink());
});
});
};
