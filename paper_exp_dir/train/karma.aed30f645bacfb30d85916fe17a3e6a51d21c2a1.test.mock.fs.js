


var e = exports;
var data = {};

var Stats = function(isDirectory) {
this.isDirectory = function() {
return isDirectory;
};
};

var getPointer = function(path, pointer) {
var parts = path.split('/').slice(1);

