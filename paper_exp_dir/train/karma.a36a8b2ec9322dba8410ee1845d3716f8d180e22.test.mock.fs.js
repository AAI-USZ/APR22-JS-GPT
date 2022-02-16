

var util = require('util');
var predictableNextTick = require('./util').predictableNextTick;


var Stats = function(isFile, mtime) {
this.mtime = mtime;
this.isDirectory = function() {
return !isFile;
};
this.isFile = function() {
return isFile;
};
};

var File = function(mtime, content) {
this.mtime = mtime;
this.content = content || '';
this.getStats = function() {
return new Stats(true, new Date(this.mtime));
};
this.getBuffer = function() {
return new Buffer(this.content);
};
};


var Mock = function(structure) {
var watchers = {};

var getPointer = function(path, pointer) {
var parts = path.split('/').slice(1);

while (parts.length) {
if (!pointer[parts[0]]) break;
pointer = pointer[parts.shift()];
}

return parts.length ? null : pointer;
};

var validatePath = function(path) {
if (path.charAt(0) !== '/') {
throw new Error('Relative path not supported !');
}
};


this.stat = function(path, callback) {
validatePath(path);
predictableNextTick(function() {
var pointer = getPointer(path, structure);
if (!pointer) return callback({});

var stats = pointer instanceof File ? pointer.getStats() :
new Stats(typeof pointer !== 'object');
return callback(null, stats);
});
};

this.readdir = function(path, callback) {
validatePath(path);
predictableNextTick(function() {
var pointer = getPointer(path, structure);
return pointer && typeof pointer === 'object' && !(pointer instanceof File) ?
callback(null, Object.getOwnPropertyNames(pointer).sort()) : callback({});
});
};

this.readFile = function(path, encoding, callback) {
var readFileSync = this.readFileSync;
callback = callback || encoding;

predictableNextTick(function() {
var data = null;
var error = null;

try {
data = readFileSync(path);
} catch(e) {
