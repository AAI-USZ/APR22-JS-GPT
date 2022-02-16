


(function(){

JSpec = {

version   : '2.11.13',
cache     : {},
suites    : [],
modules   : [],
allSuites : [],
matchers  : {},
stubbed   : [],
request   : 'XMLHttpRequest' in this ? XMLHttpRequest : null,
stats     : { specs: 0, assertions: 0, failures: 0, passes: 0, specsFinished: 0, suitesFinished: 0 },
options   : { profile: false },



defaultContext : {



an_instance_of : function(constructor) {
return { an_instance_of : constructor }
},



fixture : function(path) {
if (JSpec.cache[path]) return JSpec.cache[path]
return JSpec.cache[path] =
JSpec.tryLoading(path) ||
JSpec.tryLoading('fixtures/' + path) ||
JSpec.tryLoading('fixtures/' + path + '.html') ||
JSpec.tryLoading('spec/' + path) ||
JSpec.tryLoading('spec/fixtures/' + path) ||
JSpec.tryLoading('spec/fixtures/' + path + '.html')
}
},



formatters : {



Server : function(results, options) {
var uri = options.uri || 'http://' + window.location.host + '/results'
JSpec.post(uri, {
stats: JSpec.stats,
options: options,
results: map(results.allSuites, function(suite) {
if (suite.hasSpecs())
return {
description: suite.description,
specs: map(suite.specs, function(spec) {
return {
description: spec.description,
message: !spec.passed() ? spec.failure().message : null,
status: spec.requiresImplementation() ? 'pending' :
spec.passed() ? 'pass' :
'fail',
assertions: map(spec.assertions, function(assertion){
return {
passed: assertion.passed
}
})
}
})
}
})
})
if ('close' in main) main.close()
},



DOM : function(results, options) {
var id = option('reportToId') || 'jspec'
var report = document.getElementById(id)
var failuresOnly = option('failuresOnly')
var classes = results.stats.failures ? 'has-failures' : ''
if (!report) throw 'JSpec requires the element #' + id + ' to output its reports'

function bodyContents(body) {
return JSpec.
escape(JSpec.contentsOf(body)).
replace(/^ */gm, function(a){ return (new Array(Math.round(a.length / 3))).join(' ') }).
replace(/\r\n|\r|\n/gm, '<br/>')
}

report.innerHTML = '<div id="jspec-report" class="' + classes + '"><div class="heading"> \
<span class="passes">Passes: <em>' + results.stats.passes + '</em></span>                \
<span class="failures">Failures: <em>' + results.stats.failures + '</em></span>          \
</div><table class="suites">' + map(results.allSuites, function(suite) {
var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
if (displaySuite && suite.hasSpecs())
return '<tr class="description"><td colspan="2">' + escape(suite.description) + '</td></tr>' +
map(suite.specs, function(i, spec) {
return '<tr class="' + (i % 2 ? 'odd' : 'even') + '">' +
(spec.requiresImplementation() ?
'<td class="requires-implementation" colspan="2">' + escape(spec.description) + '</td>' :
(spec.passed() && !failuresOnly) ?
'<td class="pass">' + escape(spec.description)+ '</td><td>' + spec.assertionsGraph() + '</td>' :
!spec.passed() ?
'<td class="fail">' + escape(spec.description) +
map(spec.failures(), function(a){ return '<em>' + escape(a.message) + '</em>' }).join('') +
'</td><td>' + spec.assertionsGraph() + '</td>' :
'') +
'<tr class="body"><td colspan="2"><pre>' + bodyContents(spec.body) + '</pre></td></tr>'
}).join('') + '</tr>'
}).join('') + '</table></div>'
},



Terminal : function(results, options) {
failuresOnly = option('failuresOnly')
print(color("\n Passes: ", 'bold') + color(results.stats.passes, 'green') +
color(" Failures: ", 'bold') + color(results.stats.failures, 'red') + "\n")

function indent(string) {
return string.replace(/^(.)/gm, '  $1')
}

each(results.allSuites, function(suite) {
var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
if (displaySuite && suite.hasSpecs()) {
print(color(' ' + suite.description, 'bold'))
each(suite.specs, function(spec){
var assertionsGraph = inject(spec.assertions, '', function(graph, assertion){
return graph + color('.', assertion.passed ? 'green' : 'red')
})
if (spec.requiresImplementation())
print(color('  ' + spec.description, 'blue') + assertionsGraph)
else if (spec.passed() && !failuresOnly)
print(color('  ' + spec.description, 'green') + assertionsGraph)
else if (!spec.passed())
print(color('  ' + spec.description, 'red') + assertionsGraph +
"\n" + indent(map(spec.failures(), function(a){ return a.message }).join("\n")) + "\n")
})
print("")
}
})

quit(results.stats.failures)
},



Console : function(results, options) {
console.log('')
console.log('Passes: ' + results.stats.passes + ' Failures: ' + results.stats.failures)
each(results.allSuites, function(suite) {
if (suite.ran) {
