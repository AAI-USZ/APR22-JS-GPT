

var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');



if (!fs.exists || !fs.existsSync){
fs.exists = pathFn.exists;
fs.existsSync = pathFn.existsSync;
}



var join = function(parent, child){
return parent ? pathFn.join(parent, child) : child;
};



var mkdirs = exports.mkdirs = function(path, callback){
var parent = pathFn.dirname(path);

fs.exists(parent, function(exist){
if (exist){
fs.mkdir(path, callback);
} else {
mkdirs(parent, function(){
fs.mkdir(path, callback);
});
}
});
};



var checkParent = function(path, callback){
var parent = pathFn.dirname(path);

fs.exists(parent, function(exist){
if (exist) return callback();

mkdirs(parent, function(err){
if (err && err.code === 'EEXIST') return callback();

callback(err);
});
});
};



var writeFile = exports.writeFile = function(path, data, options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
checkParent: true
