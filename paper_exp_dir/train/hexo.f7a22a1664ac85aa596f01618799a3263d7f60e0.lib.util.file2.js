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
var defaults = {
checkParent: true
};

if (_.isFunction(options)){
callback = options;
options = {};
}

options = _.extend(defaults, options);

async.series([

function(next){
if (!options.checkParent) return next();

checkParent(path, next);
}
], function(err){
if (err) return callback(err);

fs.writeFile(path, data, options, callback);
});
};

var copyFile = exports.copyFile = function(src, dest, options, callback){
var defaults = {
checkParent: true
};

if (_.isFunction(options)){
callback = options;
options = {};
}

options = _.extend(defaults, options);

async.series([

function(next){
if (!options.checkParent) return next();

checkParent(dest, next);
}
], function(err){
if (err) return callback(err);

var rs = fs.createReadStream(src),
ws = fs.createWriteStream(dest);

rs.pipe(ws)
.on('error', function(err){
if (err) callback(err);
});

ws.on('close', callback)
.on('error', function(err){
if (err) callback(err);
});
});
};

var copyDir = exports.copyDir = function(src, dest, options, callback){
var defaults = {
ignoreHidden: true,
ignorePattern: null
};

if (_.isFunction(options)){
callback = options;
options = {};
}

