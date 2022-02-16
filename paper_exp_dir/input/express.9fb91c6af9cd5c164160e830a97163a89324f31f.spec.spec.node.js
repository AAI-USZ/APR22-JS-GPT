require.paths.unshift("../jspec-2.11.2/lib", "./lib");
process.mixin(GLOBAL, require("sys"))

require("jspec")
require("express")
require("express.mocks")

var posix = require("posix");
readFile = function(path, callback) {
var promise = posix.cat(path, "utf8")
promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
promise.addCallback(function(contents){
callback(contents)
})
promise.wait()
}

