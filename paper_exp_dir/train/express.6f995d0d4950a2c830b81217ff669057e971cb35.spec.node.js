
require.paths.unshift('spec', 'lib', 'spec/lib', 'spec/support/libxmljs')
require("jspec")
require("express")
require("express/spec")

quit = process.exit
print = puts

readFile = function(path) {
var result
require('posix')
.cat(path, "utf8")
.addCallback(function(contents){ result = contents })
.addErrback(function(){ throw new Error("failed to read file `" + path + "'") })
.wait()
return result
}

if (process.ARGV[2])
