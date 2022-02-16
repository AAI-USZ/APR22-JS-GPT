var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
join = pathFn.join,
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
fs.exists = pathFn.exists;
fs.existsSync = pathFn.existsSync;
}

var sep = exports.sep = pathFn.sep;
var delimiter = exports.delimiter = pathFn.delimiter;

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

mkdirs(parent, callback);
});
};

var writeFile = exports.writeFile = function(path, data, options, callback){
if (_.isFunction(options)){
callback = options;
options = {};
}

options = _.defaults(options, {
checkParent: true
});

async.series([

function(next){
