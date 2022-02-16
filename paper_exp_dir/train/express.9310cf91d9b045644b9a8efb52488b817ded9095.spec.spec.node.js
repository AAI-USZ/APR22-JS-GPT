require.paths.unshift("./spec/lib", "./lib");

require("jspec")
require("express")
require("express/spec")

quit = process.exit
print = puts

readFile = function(path) {
var promise = require('posix').cat(path, "utf8")
