

var util = require('util');


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
this.mtime = new Date(mtime);
this.content = content || '';
this.getStats = function() {
return new Stats(true, this.mtime);
};
this.getBuffer = function() {
return new Buffer(this.content);
};
};


var Mock = function(structure) {
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
process.nextTick(function() {
var pointer = getPointer(path, structure);
