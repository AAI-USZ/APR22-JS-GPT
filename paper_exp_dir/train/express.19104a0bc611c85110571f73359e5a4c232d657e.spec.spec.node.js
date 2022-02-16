require.paths.unshift("./spec/lib", "./lib");
process.mixin(GLOBAL, require("sys"))

require("jspec")
require("express")
require("express/spec")

var posix = require('posix')

quit = process.exit
print = puts

readFile = function(path) {
var promise = posix.cat(path, "utf8")
var result = ''
