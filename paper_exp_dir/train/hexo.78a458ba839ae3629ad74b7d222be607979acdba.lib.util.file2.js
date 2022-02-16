

var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
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
}, options);

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



var appendFile = exports.appendFile = function(path, data, options, callback){
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
}, options);

async.series([

function(next){
if (!options.checkParent) return next();

checkParent(path, next);
}
], function(err){
if (err) return callback(err);

fs.appendFile(path, data, options, callback);
});
};



var copyFile = exports.copyFile = function(src, dest, options, callback){
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
}, options);

var called = false;

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
if (err && !called){
called = true;
callback(err);
}
});

ws.on('close', callback)
.on('error', function(err){
if (err && !called){
called = true;
callback(err);
}
});
});
};



var copyDir = exports.copyDir = function(src, dest, options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
ignoreHidden: true,
ignorePattern: null
}, options);

async.series([

function(next){
fs.exists(dest, function(exist){
if (exist) return next();

mkdirs(dest, next);
});
}
], function(err){
if (err) return callback(err);

fs.readdir(src, function(err, files){
if (err) return callback(err);

async.each(files, function(item, next){
if (options.ignoreHidden && item[0] === '.') return next();
if (options.ignorePattern && options.ignorePattern.test(item)) return next();

var childSrc = join(src, item),
childDest = join(dest, item);

fs.stat(childSrc, function(err, stats){
if (err) return callback(err);

if (stats.isDirectory()){
copyDir(childSrc, childDest, options, next);
} else {
copyFile(childSrc, childDest, {checkParent: false}, next);
}
});
}, callback);
});
});
};



var list = exports.list = function(path, options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
ignoreHidden: true,
ignorePattern: null
}, options);

var parent = options._parent;

fs.readdir(path, function(err, files){
if (err) return callback(err);

var arr = [];

async.each(files, function(item, next){
if (options.ignoreHidden && item[0] === '.') return next();
if (options.ignorePattern && options.ignorePattern.test(item)) return next();

var childPath = join(path, item);

fs.stat(childPath, function(err, stats){
if (err) return callback(err);

if (stats.isDirectory()){
var childOptions = _.extend({}, options, {
_parent: parent ? join(parent, item) : item
});

list(childPath, childOptions, function(err, files){
if (err) return callback(err);

arr = arr.concat(files);

next();
});
} else {
if (parent){
arr.push(join(parent, item));
} else {
arr.push(item);
}

next();
}
});
}, function(err){
callback(err, arr);
});
});
};

var escape = function(str){

var str = EOL === '\n' ? str : str.replace(EOLre, '\n');


str = str.replace(/^\uFEFF/, '');

return str;
};



var readFile = exports.readFile = function(path, options, callback){
if (!callback){
