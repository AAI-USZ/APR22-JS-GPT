

var util = require('util');
var randomNextTick = require('./util').randomNextTick;


var Stats = function(isFile, mtime) {
this.mtime = mtime;
this.isDirectory = function() {
return !isFile;
};
this.isFile = function() {
return isFile;
};
};
