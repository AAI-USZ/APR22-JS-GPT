process.mixin(GLOBAL, require("sys"))
var posix = require("posix");
__loading__ = []
__loadDelay__ = 800

readFile = function(path, callback) {
__loading__.push(path)
var promise = posix.cat(path, "utf8")
promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
promise.addCallback(function(contents){
