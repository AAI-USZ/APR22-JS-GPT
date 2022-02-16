


;(function(){

JSpec = {
version   : '3.0.0',
assert    : true,
cache     : {},
suites    : [],
modules   : [],
allSuites : [],
matchers  : {},
stubbed   : [],
options   : {},
request   : 'XMLHttpRequest' in this ? XMLHttpRequest : null,
stats     : { specs: 0, assertions: 0, failures: 0, passes: 0, specsFinished: 0, suitesFinished: 0 },



defaultContext : {



an_instance_of : function(constructor) {
return { an_instance_of : constructor }
},



fixture : function(path) {
if (JSpec.cache[path]) return JSpec.cache[path]
return JSpec.cache[path] =
JSpec.tryLoading(JSpec.options.fixturePath + '/' + path) ||
JSpec.tryLoading(JSpec.options.fixturePath + '/' + path + '.html')
}
},
