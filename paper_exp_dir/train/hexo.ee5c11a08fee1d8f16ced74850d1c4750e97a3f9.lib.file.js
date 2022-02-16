var fs = require('graceful-fs'),
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

var copy = exports.copy = function(source, destination){
var parent = path.dirname(destination);

fs.exists(parent, function(exist){
if (exist){
fs.createReadStream(source).pipe(fs.createWriteStream(destination));
} else {
mkdir(parent, function(){
fs.createReadStream(source).pipe(fs.createWriteStream(destination));
});
}
})
};

var dir = exports.dir = function(source, callback, parent){
fs.exists(source, function(exist){
if (exist){
fs.readdir(source, function(err, files){
if (err) throw err;

var result = [];

async.forEach(files, function(item, next){
var extname = path.extname(item);

if (extname === ''){
