require.paths.unshift("./spec/lib", "./lib");
process.mixin(GLOBAL, require("sys"))

require("jspec")
require("express")
require("express.mocks")

var posix = require('posix')

quit = process.exit
print = puts

readFile = function(path) {
var promise = posix.cat(path, "utf8")
var result = ''
promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
promise.addCallback(function(contents){
