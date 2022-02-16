

var util = require('util');


var Stats = function(isFile, mtime) {
this.mtime = mtime;
this.isDirectory = function() {
return !isFile;
};
this.isFile = function() {
return isFile;
};
