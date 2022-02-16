


var e = exports;
var data = {};

var Stats = function(isDirectory) {
this.isDirectory = function() {
return isDirectory;
};
};

var getPointer = function(path, pointer) {
var parts = path.split('/').slice(1);

while (parts.length) {
if (!pointer[parts[0]]) break;
pointer = pointer[parts.shift()];
}

return parts.length ? null : pointer;
};

var validatePath = function(path) {
if (path.charAt(0) !== '/') throw 'Relative path not supported !';
};


e.stat = function(path, callback) {
validatePath(path);
process.nextTick(function() {
var pointer = getPointer(path, data);
return pointer ? callback(null, new Stats(typeof pointer == 'object')) :
callback({});
});
};

e.readdir = function(path, callback) {
validatePath(path);
process.nextTick(function() {
var pointer = getPointer(path, data);
return pointer && typeof pointer === 'object' ?
callback(null, Object.getOwnPropertyNames(pointer)) : callback({});
});
};


e.init = function(structure) {
data = structure;
queue = [];
};

