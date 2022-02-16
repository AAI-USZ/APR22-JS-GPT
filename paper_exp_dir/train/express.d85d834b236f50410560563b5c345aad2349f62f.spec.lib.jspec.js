


;(function(){

JSpec = {
version   : '4.2.1',
assert    : true,
cache     : {},
suites    : [],
modules   : [],
allSuites : [],
sharedBehaviors: [],
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
},



json_fixture: function(path) {
if (!JSpec.cache['json:' + path])
JSpec.cache['json:' + path] =
JSpec.tryLoading(JSpec.options.fixturePath + '/' + path) ||
JSpec.tryLoading(JSpec.options.fixturePath + '/' + path + '.json')
try {
return eval('(' + JSpec.cache['json:' + path] + ')')
} catch (e) {
throw 'json_fixture("' + path + '"): ' + e
}
}
},



reporters : {



Server : function(results, options) {
var uri = options.uri || 'http://' + window.location.host + '/results'
JSpec.post(uri, {
stats: JSpec.stats,
options: options,
results: map(results.allSuites, function(suite) {
if (suite.isExecutable())
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
var id = option('reportToId') || 'jspec',
report = document.getElementById(id),
failuresOnly = option('failuresOnly'),
classes = results.stats.failures ? 'has-failures' : ''
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
<span class="passes">Duration: <em>' + results.duration + '</em> ms</span>          \
</div><table class="suites">' + map(results.allSuites, function(suite) {
var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
if (displaySuite && suite.isExecutable())
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
var failuresOnly = option('failuresOnly')
print(color("\n Passes: ", 'bold') + color(results.stats.passes, 'green') +
color(" Failures: ", 'bold') + color(results.stats.failures, 'red') +
color(" Duration: ", 'bold') + color(results.duration, 'green') + " ms \n")

function indent(string) {
return string.replace(/^(.)/gm, '  $1')
}

each(results.allSuites, function(suite) {
var displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
if (displaySuite && suite.isExecutable()) {
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
}
},

Assertion : function(matcher, actual, expected, negate) {
extend(this, {
message: '',
passed: false,
actual: actual,
negate: negate,
matcher: matcher,
expected: expected,



report : function() {
if (JSpec.assert)
this.passed ? JSpec.stats.passes++ : JSpec.stats.failures++
return this
},



run : function() {

expected.unshift(actual)
this.result = matcher.match.apply(this, expected)
this.passed = negate ? !this.result : this.result
if (!this.passed) this.message = matcher.message.call(this, actual, expected, negate, matcher.name)
return this
}
})
},

ProxyAssertion : function(object, method, times, negate) {
var self = this,
old = object[method]



object[method] = function(){
var args = toArray(arguments),
result = old.apply(object, args)
self.calls.push({ args : args, result : result })
return result
}



this.times = {
once  : 1,
twice : 2
}[times] || times || 1

extend(this, {
calls: [],
message: '',
defer: true,
passed: false,
negate: negate,
object: object,
method: method,



and_return : function(result) {
this.expectedResult = result
return this
},



with_args : function() {
this.expectedArgs = toArray(arguments)
return this
},



anyResultsFail : function() {
return any(this.calls, function(call){
return self.expectedResult.an_instance_of ?
call.result.constructor != self.expectedResult.an_instance_of:
!equal(self.expectedResult, call.result)
})
},



anyResultsPass : function() {
return any(this.calls, function(call){
return self.expectedResult.an_instance_of ?
call.result.constructor == self.expectedResult.an_instance_of:
equal(self.expectedResult, call.result)
})
},



passingResult : function() {
return this.anyResultsPass().result
},



failingResult : function() {
return this.anyResultsFail().result
},



anyArgsFail : function() {
return any(this.calls, function(call){
return any(self.expectedArgs, function(i, arg){
if (arg == null) return call.args[i] == null
return arg.an_instance_of ?
call.args[i].constructor != arg.an_instance_of:
!equal(arg, call.args[i])

})
})
},



anyArgsPass : function() {
return any(this.calls, function(call){
return any(self.expectedArgs, function(i, arg){
return arg.an_instance_of ?
call.args[i].constructor == arg.an_instance_of:
equal(arg, call.args[i])

})
})
},



passingArgs : function() {
return this.anyArgsPass().args
},



failingArgs : function() {
return this.anyArgsFail().args
},



report : function() {
if (JSpec.assert)
this.passed ? ++JSpec.stats.passes : ++JSpec.stats.failures
return this
},



run : function() {
var methodString = 'expected ' + object.toString() + '.' + method + '()' + (negate ? ' not' : '' )

function times(n) {
return n > 2 ?  n + ' times' : { 1: 'once', 2: 'twice' }[n]
}

if (this.expectedResult != null && (negate ? this.anyResultsPass() : this.anyResultsFail()))
this.message = methodString + ' to return ' + puts(this.expectedResult) +
' but ' + (negate ? 'it did' : 'got ' + puts(this.failingResult()))

if (this.expectedArgs && (negate ? !this.expectedResult && this.anyArgsPass() : this.anyArgsFail()))
this.message = methodString + ' to be called with ' + puts.apply(this, this.expectedArgs) +
' but was' + (negate ? '' : ' called with ' + puts.apply(this, this.failingArgs()))

if (negate ? !this.expectedResult && !this.expectedArgs && this.calls.length >= this.times : this.calls.length != this.times)
this.message = methodString + ' to be called ' + times(this.times) +
', but ' +  (this.calls.length == 0 ? ' was not called' : ' was called ' + times(this.calls.length))

if (!this.message.length)
this.passed = true

return this
}
})
},



Suite : function(description, body, isShared) {
var self = this
extend(this, {
body: body,
description: description,
suites: [],
sharedBehaviors: [],
specs: [],
ran: false,
shared: isShared,
hooks: { 	'before' : [], 'after' : [],
'before_each' : [], 'after_each' : [],
'before_nested' : [], 'after_nested' : []},



addSpec : function(description, body) {
var spec = new JSpec.Spec(description, body)
this.specs.push(spec)
JSpec.stats.specs++
spec.suite = this
},



addBefore : function(options, body) {
body.options = options || {}
this.befores.push(body)
},



addAfter : function(options, body) {
body.options = options || {}
this.afters.unshift(body)
},



addHook : function(hook, body) {
this.hooks[hook].push(body)
},



addSuite : function(description, body, isShared) {
var suite = new JSpec.Suite(description, body, isShared)
JSpec.allSuites.push(suite)
suite.name = suite.description
suite.description = this.description + ' ' + suite.description
this.suites.push(suite)
suite.suite = this
},



hook : function(hook) {
if (hook != 'before' && hook != 'after')
if (this.suite) this.suite.hook(hook)

each(this.hooks[hook], function(body) {
JSpec.evalBody(body, "Error in hook '" + hook + "', suite '" + self.description + "': ")
})
},



hasSuites : function() {
return this.suites.length
},



hasSpecs : function() {
return this.specs.length
},



passed : function() {
return !any(this.specs, function(spec){
return !spec.passed()
})
},

isShared : function(){
return this.shared
},

isExecutable : function() {
return !this.isShared() && this.hasSpecs()
}
})
},



Spec : function(description, body) {
extend(this, {
body: body,
description: description,
assertions: [],



pass : function(message) {
this.assertions.push({ passed: true, message: message })
if (JSpec.assert) ++JSpec.stats.passes
},



fail : function(message) {
this.assertions.push({ passed: false, message: message })
if (JSpec.assert) ++JSpec.stats.failures
},



runDeferredAssertions : function() {
each(this.assertions, function(assertion){
if (assertion.defer) assertion.run().report(), hook('afterAssertion', assertion)
})
},



failure : function() {
return find(this.assertions, function(assertion){
return !assertion.passed
})
},



failures : function() {
return select(this.assertions, function(assertion){
return !assertion.passed
})
},



passed : function() {
return !this.failure()
},



requiresImplementation : function() {
return this.assertions.length == 0
},



assertionsGraph : function() {
return map(this.assertions, function(assertion){
return '<span class="assertion ' + (assertion.passed ? 'passed' : 'failed') + '"></span>'
}).join('')
}
})
},

Module : function(methods) {
extend(this, methods)
},

JSON : {



meta : {
'\b' : '\\b',
'\t' : '\\t',
'\n' : '\\n',
'\f' : '\\f',
'\r' : '\\r',
'"'  : '\\"',
'\\' : '\\\\'
},



escapable : /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

/**
* JSON encode _object_.
*
* @param  {mixed} object
* @return {string}
* @api private
*/

encode : function(object) {
var self = this
if (object == undefined || object == null) return 'null'
if (object === true) return 'true'
if (object === false) return 'false'
switch (typeof object) {
case 'number': return object
case 'string': return this.escapable.test(object) ?
'"' + object.replace(this.escapable, function (a) {
return typeof self.meta[a] === 'string' ? self.meta[a] :
'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
}) + '"' :
'"' + object + '"'
case 'object':
if (object.constructor == Array)
return '[' + map(object, function(val){
return self.encode(val)
}).join(', ') + ']'
else if (object)
return '{' + map(object, function(key, val){
return self.encode(key) + ':' + self.encode(val)
}).join(', ') + '}'
}
return 'null'
}
},

// --- DSLs

DSLs : {
snake : {
expect : function(actual){
return JSpec.expect(actual)
},

describe : function(description, body) {
return JSpec.currentSuite.addSuite(description, body, false)
},

it : function(description, body) {
return JSpec.currentSuite.addSpec(description, body)
},

before : function(body) {
return JSpec.currentSuite.addHook('before', body)
},

after : function(body) {
return JSpec.currentSuite.addHook('after', body)
},

before_each : function(body) {
return JSpec.currentSuite.addHook('before_each', body)
},

after_each : function(body) {
return JSpec.currentSuite.addHook('after_each', body)
},

before_nested : function(body) {
return JSpec.currentSuite.addHook('before_nested', body)
},

after_nested : function(body){
return JSpec.currentSuite.addhook('after_nested', body)
},

shared_behaviors_for : function(description, body){
return JSpec.currentSuite.addSuite(description, body, true)
},

should_behave_like : function(description) {
return JSpec.shareBehaviorsOf(description)
}
}
},

// --- Methods

/**
* Check if _value_ is 'stop'. For use as a
* utility callback function.
*
* @param  {mixed} value
* @return {bool}
* @api public
*/

haveStopped : function(value) {
return value === 'stop'
},

/**
* Include _object_ which may be a hash or Module instance.
*
* @param  {hash, Module} object
* @return {JSpec}
* @api public
*/

include : function(object) {
var module = object.constructor == JSpec.Module ? object : new JSpec.Module(object)
this.modules.push(module)
if ('init' in module) module.init()
if ('utilities' in module) extend(this.defaultContext, module.utilities)
if ('matchers' in module) this.addMatchers(module.matchers)
if ('reporters' in module) extend(this.reporters, module.reporters)
if ('DSLs' in module)
each(module.DSLs, function(name, methods){
JSpec.DSLs[name] = JSpec.DSLs[name] || {}
extend(JSpec.DSLs[name], methods)
})
return this
},

/**
* Add a module hook _name_, which is immediately
* called per module with the _args_ given. An array of
* hook return values is returned.
*
* @param  {name} string
* @param  {...} args
* @return {array}
* @api private
*/

hook : function(name, args) {
args = toArray(arguments, 1)
return inject(JSpec.modules, [], function(results, module){
if (typeof module[name] == 'function')
results.push(JSpec.evalHook(module, name, args))
})
},

/**
* Eval _module_ hook _name_ with _args_. Evaluates in context
* to the module itself, JSpec, and JSpec.context.
*
* @param  {Module} module
* @param  {string} name
* @param  {array} args
* @return {mixed}
* @api private
*/

evalHook : function(module, name, args) {
hook('evaluatingHookBody', module, name)
return module[name].apply(module, args)
},

/**
* Same as hook() however accepts only one _arg_ which is
* considered immutable. This function passes the arg
* to the first module, then passes the return value of the last
* module called, to the following module.
*
* @param  {string} name
* @param  {mixed} arg
* @return {mixed}
* @api private
*/

hookImmutable : function(name, arg) {
return inject(JSpec.modules, arg, function(result, module){
if (typeof module[name] == 'function')
return JSpec.evalHook(module, name, [result])
})
},

/**
* Find a shared example suite by its description or name.
* First searches parent tree of suites for shared behavior
* before falling back to global scoped nested behaviors.
*
* @param  {string} description
* @return {Suite}
* @api private
*/

findSharedBehavior : function(description) {
var behavior
return (behavior = JSpec.findLocalSharedBehavior(description))
? behavior
: JSpec.findGlobalSharedBehavior(description)
},

/**
* Find a shared example suite within the current suite's
* parent tree by its description or name.
*
* @param  {string} description
* @return {Suite}
* @api private
*/

findLocalSharedBehavior : function(description) {
var behavior,
currentSuite = JSpec.currentSuite.suite
while (currentSuite)
if (behavior = find(currentSuite.suites, JSpec.suiteDescriptionPredicate(description)))
return behavior
else
currentSuite = currentSuite.suite
},

/**
* Find a shared example suite within the global
* scope by its description or name.
*
* @param  {string} description
* @return {Suite}
* @api private
*/

findGlobalSharedBehavior : function(description) {
return find(JSpec.suites, JSpec.suiteDescriptionPredicate(description))
},

/**
* Build a predicate that will match a suite based on name or description
*
* @param  {string} description
* @return {function}
* @api private
*/

suiteDescriptionPredicate : function(description) {
return function(suite){
return suite.name === description ||
suite.description === description
}
},

/**
* Share behaviors (specs) of the given suite with
* the current suite.
*
* @param  {string} description
* @api public
*/

shareBehaviorsOf : function(description) {
var suite = JSpec.findSharedBehavior(description)
if (suite)
JSpec.evalBody(suite.body)
else
throw new Error("failed to find shared behaviors named `" + description + "'")
},


/**
* Convert arguments to an array.
*
* @param  {object} arguments
* @param  {int} offset
* @return {array}
* @api public
*/

toArray : function(arguments, offset) {
return Array.prototype.slice.call(arguments, offset || 0)
},

/**
* Return ANSI-escaped colored string.
*
* @param  {string} string
* @param  {string} color
* @return {string}
* @api public
*/

color : function(string, color) {
if (option('disableColors')) {
return string
} else {
return "\u001B[" + {
bold    : 1,
black   : 30,
