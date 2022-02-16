var fs = require('graceful-fs'),
path = require('path'),
async = require('async'),
_ = require('lodash'),
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
fs.exists = path.exists;
fs.existsSync = path.existsSync;
}

var mkdir = exports.mkdir = function(destination, callback){
var parent = path.dirname(destination);

fs.exists(parent, function(exist){
if (exist){
fs.mkdir(destination, callback);
} else {
mkdir(parent, function(){
fs.mkdir(destination, callback);
});
}
});
};

var writeFile = function(destination, content, callback) {
fs.open(destination, "w", function(err, fd) {
if (err) callback(err);
fs.write(fd, content, 0, "utf8", function(err, written, buffer) {
callback(err);
});
});
};

var write = exports.write = function(destination, content, callback){
