

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
