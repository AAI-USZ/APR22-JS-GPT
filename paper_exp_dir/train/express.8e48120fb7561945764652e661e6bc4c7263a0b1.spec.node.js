
require.paths.unshift('spec', 'lib', 'spec/lib')
require("jspec")
require("express")
require("express/spec")

function run(specs) {
specs.forEach(function(spec){
JSpec.exec('spec/spec.' + spec + '.js')
})
}

specs = {
independant: [
'core',
'routing',
