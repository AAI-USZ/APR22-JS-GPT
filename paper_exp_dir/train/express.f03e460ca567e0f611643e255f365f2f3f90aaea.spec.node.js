
require.paths.unshift('spec', 'lib', 'spec/lib', 'spec/support/libxmljs')
require("jspec")
require("express")
require("express/spec")

print = puts
quit = process.exit
readFile = require('fs').readFileSync

function run(specs) {
specs.forEach(function(spec){
JSpec.exec('spec/spec.' + spec + '.js')
})
}

