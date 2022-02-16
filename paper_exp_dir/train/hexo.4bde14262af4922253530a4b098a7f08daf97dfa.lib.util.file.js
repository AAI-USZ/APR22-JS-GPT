var fs = require('fs'),
path = require('path'),
async = require('async');

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

var write = exports.write = function(destination, content, callback){
var parent = path.dirname(destination);

fs.exists(parent, function(exist){
if (exist){
fs.writeFile(destination, content, callback);
} else {
mkdir(parent, function(){
fs.writeFile(destination, content, callback);
});
}
});
};

var copy = exports.copy = function(source, destination, callback){
var parent = path.dirname(destination);

async.series([
function(next){
fs.exists(parent, function(exist){
if (exist) next();
else mkdir(parent, next);
});
}
], function(){
var rs = fs.createReadStream(source),
ws = fs.createWriteStream(destination);

