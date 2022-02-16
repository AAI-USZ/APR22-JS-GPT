require.paths.unshift("./spec/lib", "./lib");
process.mixin(GLOBAL, require("sys"))

require("jspec")
require("express")
require("express.mocks")

readFile = function(path, callback) {
var promise = require('posix').cat(path, "utf8")
promise.addErrback(function(){ throw "failed to read file `" + path + "'" })
promise.addCallback(function(contents){
callback(contents)
})
promise.wait()
}

print = puts
