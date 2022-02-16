
require.paths.unshift('spec', 'lib', 'spec/lib')
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

specs = {
independant: [
'core',
'routing',
'utils',
'request',
'mime',
'static',
'plugins',
'plugins.cache',
'plugins.view',
'plugins.common-logger',
'plugins.content-length',
'plugins.method-override',
'plugins.body-decoder',
'plugins.redirect',
'plugins.hooks',
'plugins.cookie',
