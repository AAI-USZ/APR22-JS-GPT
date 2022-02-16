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

rs.pipe(ws)
.on('error', function(err){
if (err) throw err;
});

ws.on('close', callback)
.on('error', function(err){
if (err) throw err;
});
});
};

var dir = exports.dir = function(source, callback, parent){
fs.exists(source, function(exist){
if (exist){
fs.readdir(source, function(err, files){
if (err) throw err;

var result = [];

async.forEach(files, function(item, next){
fs.stat(source + '/' + item, function(err, stats){
if (err) throw err;

if (stats.isDirectory()){
dir(source + '/' + item, function(children){
result = result.concat(children);
next();
}, (parent ? parent + '/' : '') + item);
} else {
result.push((parent ? parent + '/' : '') + item);
next();
}
});
}, function(){
callback(result);
});
});
} else {
return [];
}
});
};

var textProcess = function(str){

var str = EOL === '\n' ? str : str.replace(EOLre, '\n');


str = str.replace(/^\uFEFF/, '');

return str;
};

