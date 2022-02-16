



var Stats = function(isDirectory) {
this.isDirectory = function() {
return isDirectory;
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
if (path.charAt(0) !== '/') throw 'Relative path not supported !';
};


this.stat = function(path, callback) {
