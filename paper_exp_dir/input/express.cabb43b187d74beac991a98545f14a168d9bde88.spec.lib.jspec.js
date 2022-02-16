


;(function(){

JSpec = {
version   : '3.2.1',
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



reporters : {



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
<span class="passes">Duration: <em>' + results.duration + '</em> ms</span>          \
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
color(" Failures: ", 'bold') + color(results.stats.failures, 'red') +
color(" Duration: ", 'bold') + color(results.duration, 'green') + " ms \n")

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
console.group(suite.description)
each(suite.specs, function(spec){
var assertionCount = spec.assertions.length + ':'
if (spec.requiresImplementation())
console.warn(spec.description)
else if (spec.passed())
console.log(assertionCount + ' ' + spec.description)
else
console.error(assertionCount + ' ' + spec.description + ', ' + spec.failure().message)
})
console.groupEnd()
}
})
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
var self = this
var old = object[method]



object[method] = function(){
args = toArray(arguments)
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



Suite : function(description, body) {
var self = this
extend(this, {
body: body,
description: description,
suites: [],
specs: [],
ran: false,
hooks: { 'before' : [], 'after' : [], 'before_each' : [], 'after_each' : [] },



addSpec : function(description, body) {
var spec = new JSpec.Spec(description, body)
this.specs.push(spec)
JSpec.stats.specs++
spec.suite = this
},



addHook : function(hook, body) {
this.hooks[hook].push(body)
},



addSuite : function(description, body) {
var suite = new JSpec.Suite(description, body)
JSpec.allSuites.push(suite)
suite.name = suite.description
suite.description = this.description + ' ' + suite.description
this.suites.push(suite)
suite.suite = this
},



hook : function(hook) {
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
return JSpec.currentSuite.addSuite(description, body)
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
try { return module[name].apply(module, args) }
catch(e) { error('Error in hook ' + module.name + '.' + name + ': ', e) }
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
* Find a suite by its description or name.
*
* @param  {string} description
* @return {Suite}
* @api private
*/

findSuite : function(description) {
return find(this.allSuites, function(suite){
return suite.name == description || suite.description == description
})
},

/**
* Share behaviors (specs) of the given suite with
* the current suite.
*
* @param  {string} description
* @api public
*/

shareBehaviorsOf : function(description) {
if (suite = this.findSuite(description)) this.copySpecs(suite, this.currentSuite)
else throw 'failed to share behaviors. ' + puts(description) + ' is not a valid Suite name'
},

/**
* Copy specs from one suite to another.
*
* @param  {Suite} fromSuite
* @param  {Suite} toSuite
* @api public
*/

copySpecs : function(fromSuite, toSuite) {
each(fromSuite.specs, function(spec){
spec.assertions = []
toSuite.specs.push(spec)
})
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
return "\u001B[" + {
bold    : 1,
black   : 30,
red     : 31,
green   : 32,
yellow  : 33,
blue    : 34,
magenta : 35,
cyan    : 36,
white   : 37
}[color] + 'm' + string + "\u001B[0m"
},

/**
* Default matcher message callback.
*
* @api private
*/

defaultMatcherMessage : function(actual, expected, negate, name) {
return 'expected ' + puts(actual) + ' to ' +
(negate ? 'not ' : '') +
name.replace(/_/g, ' ') +
' ' + (expected.length > 1 ?
puts.apply(this, expected.slice(1)) :
'')
},

/**
* Normalize a matcher message.
*
* When no messge callback is present the defaultMatcherMessage
* will be assigned, will suffice for most matchers.
*
* @param  {hash} matcher
* @return {hash}
* @api public
*/

normalizeMatcherMessage : function(matcher) {
if (typeof matcher.message != 'function')
matcher.message = this.defaultMatcherMessage
return matcher
},

/**
* Normalize a matcher body
*
* This process allows the following conversions until
* the matcher is in its final normalized hash state.
*
* - '==' becomes 'actual == expected'
* - 'actual == expected' becomes 'return actual == expected'
* - function(actual, expected) { return actual == expected } becomes
*   { match : function(actual, expected) { return actual == expected }}
*
* @param  {mixed} body
* @return {hash}
* @api public
*/

normalizeMatcherBody : function(body) {
switch (body.constructor) {
case String:
if (captures = body.match(/^alias (\w+)/)) return JSpec.matchers[last(captures)]
if (body.length < 4) body = 'actual ' + body + ' expected'
return { match: function(actual, expected) { return eval(body) }}

case Function:
return { match: body }

default:
return body
}
},

/**
* Get option value. This method first checks if
* the option key has been set via the query string,
* otherwise returning the options hash value.
*
* @param  {string} key
* @return {mixed}
* @api public
*/

option : function(key) {
return (value = query(key)) !== null ? value :
JSpec.options[key] || null
},

/**
* Check if object _a_, is equal to object _b_.
*
* @param  {object} a
* @param  {object} b
* @return {bool}
* @api private
*/

equal: function(a, b) {
if (typeof a != typeof b) return
if (a === b) return true
if (a instanceof RegExp)
return a.toString() === b.toString()
if (a instanceof Date)
return Number(a) === Number(b)
if (typeof a != 'object') return
if (a.length !== undefined)
if (a.length !== b.length) return
else
for (var i = 0, len = a.length; i < len; ++i)
if (!equal(a[i], b[i]))
return
for (var key in a)
if (!equal(a[key], b[key]))
return
return true
},

/**
* Return last element of an array.
*
* @param  {array} array
* @return {object}
* @api public
*/

last : function(array) {
return array[array.length - 1]
},

/**
* Convert object(s) to a print-friend string.
*
* @param  {...} object
* @return {string}
* @api public
*/

puts : function(object) {
if (arguments.length > 1)
return map(toArray(arguments), function(arg){
return puts(arg)
}).join(', ')
if (object === undefined) return 'undefined'
if (object === null) return 'null'
if (object === true) return 'true'
if (object === false) return 'false'
if (object.an_instance_of) return 'an instance of ' + object.an_instance_of.name
if (object.jquery && object.selector.length > 0) return 'selector ' + puts(object.selector)
if (object.jquery) return object.get(0).outerHTML
if (object.nodeName) return object.outerHTML
switch (object.constructor) {
case Function: return object.name || object
case String:
return '"' + object
.replace(/"/g,  '\\"')
.replace(/\n/g, '\\n')
.replace(/\t/g, '\\t')
+ '"'
case Array:
return inject(object, '[', function(b, v){
return b + ', ' + puts(v)
}).replace('[,', '[') + ' ]'
case Object:
object.__hit__ = true
return inject(object, '{', function(b, k, v) {
if (k == '__hit__') return b
return b + ', ' + k + ': ' + (v && v.__hit__ ? '<circular reference>' : puts(v))
}).replace('{,', '{') + ' }'
default:
return object.toString()
}
},

/**
* Escape HTML.
*
* @param  {string} html
* @return {string}
* @api public
*/

escape : function(html) {
return html.toString()
.replace(/&/gmi, '&amp;')
.replace(/"/gmi, '&quot;')
.replace(/>/gmi, '&gt;')
.replace(/</gmi, '&lt;')
},

/**
* Perform an assertion without reporting.
*
* This method is primarily used for internal
* matchers in order retain DRYness. May be invoked
* like below:
*
*   does('foo', 'eql', 'foo')
*   does([1,2], 'include', 1, 2)
*
* External hooks are not run for internal assertions
* performed by does().
*
* @param  {mixed} actual
* @param  {string} matcher
* @param  {...} expected
* @return {mixed}
* @api private
*/

does : function(actual, matcher, expected) {
var assertion = new JSpec.Assertion(JSpec.matchers[matcher], actual, toArray(arguments, 2))
return assertion.run().result
},

/**
* Perform an assertion.
*
*   expect(true).to('be', true)
*   expect('foo').not_to('include', 'bar')
*   expect([1, [2]]).to('include', 1, [2])
*
* @param  {mixed} actual
* @return {hash}
* @api public
*/

expect : function(actual) {
function assert(matcher, args, negate) {
var expected = toArray(args, 1)
matcher.negate = negate
assertion = new JSpec.Assertion(matcher, actual, expected, negate)
hook('beforeAssertion', assertion)
if (matcher.defer) assertion.run()
else JSpec.currentSpec.assertions.push(assertion.run().report()), hook('afterAssertion', assertion)
return assertion.result
}

function to(matcher) {
return assert(matcher, arguments, false)
}

function not_to(matcher) {
return assert(matcher, arguments, true)
}

return {
to : to,
should : to,
not_to: not_to,
should_not : not_to
}
},

/**
* Strim whitespace or chars.
*
* @param  {string} string
* @param  {string} chars
* @return {string}
* @api public
*/

strip : function(string, chars) {
return string.
replace(new RegExp('['  + (chars || '\\s') + ']*$'), '').
replace(new RegExp('^[' + (chars || '\\s') + ']*'),  '')
},

/**
* Call an iterator callback with arguments a, or b
* depending on the arity of the callback.
*
* @param  {function} callback
* @param  {mixed} a
* @param  {mixed} b
* @return {mixed}
* @api private
*/

callIterator : function(callback, a, b) {
return callback.length == 1 ? callback(b) : callback(a, b)
},

/**
* Extend an object with another.
*
* @param  {object} object
* @param  {object} other
* @api public
*/

extend : function(object, other) {
each(other, function(property, value){
object[property] = value
})
},

/**
* Iterate an object, invoking the given callback.
*
* @param  {hash, array} object
* @param  {function} callback
* @return {JSpec}
* @api public
*/

each : function(object, callback) {
if (object.constructor == Array)
for (var i = 0, len = object.length; i < len; ++i)
callIterator(callback, i, object[i])
else
for (var key in object)
if (object.hasOwnProperty(key))
callIterator(callback, key, object[key])
},

/**
* Iterate with memo.
*
* @param  {hash, array} object
* @param  {object} memo
* @param  {function} callback
* @return {object}
* @api public
*/

inject : function(object, memo, callback) {
each(object, function(key, value){
memo = (callback.length == 2 ?
callback(memo, value):
callback(memo, key, value)) ||
memo
})
return memo
},

/**
* Destub _object_'s _method_. When no _method_ is passed
* all stubbed methods are destubbed. When no arguments
* are passed every object found in JSpec.stubbed will be
* destubbed.
*
* @param  {mixed} object
* @param  {string} method
* @api public
*/

destub : function(object, method) {
if (method) {
if (object['__prototype__' + method])
delete object[method]
else
object[method] = object['__original__' + method]
delete object['__prototype__' + method]
delete object['__original____' + method]
}
else if (object) {
for (var key in object)
if (captures = key.match(/^(?:__prototype__|__original__)(.*)/))
destub(object, captures[1])
}
else
while (JSpec.stubbed.length)
destub(JSpec.stubbed.shift())
},



stub : function(object, method) {
hook('stubbing', object, method)
JSpec.stubbed.push(object)
var type = object.hasOwnProperty(method) ? '__original__' : '__prototype__'
object[type + method] = object[method]
object[method] = function(){}
return {
and_return : function(value) {
if (typeof value == 'function') object[method] = value
else object[method] = function(){ return value }
}
}
},



map : function(object, callback) {
return inject(object, [], function(memo, key, value){
memo.push(callIterator(callback, key, value))
})
},



any : function(object, callback) {
return inject(object, null, function(state, key, value){
if (state == undefined)
return callIterator(callback, key, value) ? value : state
})
},



select : function(object, callback) {
return inject(object, [], function(selected, key, value){
if (callIterator(callback, key, value))
selected.push(value)
})
},



addMatchers : function(matchers) {
each(matchers, function(name, body){
JSpec.addMatcher(name, body)
})
},



addMatcher : function(name, body) {
hook('addingMatcher', name, body)
if (name.indexOf(' ') != -1) {
var matchers = name.split(/\s+/)
var prefix = matchers.shift()
each(matchers, function(name) {
JSpec.addMatcher(prefix + '_' + name, body(name))
})
}
this.matchers[name] = this.normalizeMatcherMessage(this.normalizeMatcherBody(body))
this.matchers[name].name = name
},



describe : function(description, body) {
var suite = new JSpec.Suite(description, body)
hook('addingSuite', suite)
this.allSuites.push(suite)
this.suites.push(suite)
},



contentsOf : function(body) {
return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
},



evalBody : function(body, errorMessage) {
var dsl = this.DSL || this.DSLs.snake
var matchers = this.matchers
var context = this.context || this.defaultContext
var contents = this.contentsOf(body)
hook('evaluatingBody', dsl, matchers, context, contents)
try { with (dsl){ with (context) { with (matchers) { eval(contents) }}} }
catch(e) { error(errorMessage, e) }
},



preprocess : function(input) {
if (typeof input != 'string') return
input = hookImmutable('preprocessing', input)
return input.
replace(/\t/g, '  ').
replace(/\r\n|\n|\r/g, '\n').
split('__END__')[0].
replace(/([\w\.]+)\.(stub|destub)\((.*?)\)$/gm, '$2($1, $3)').
replace(/describe\s+(.*?)$/gm, 'describe($1, function(){').
replace(/^\s+it\s+(.*?)$/gm, ' it($1, function(){').
replace(/^ *(before_each|after_each|before|after)(?= |\n|$)/gm, 'JSpec.currentSuite.addHook("$1", function(){').
replace(/^\s*end(?=\s|$)/gm, '});').
replace(/-\{/g, 'function(){').
replace(/(\d+)\.\.(\d+)/g, function(_, a, b){ return range(a, b) }).
replace(/\.should([_\.]not)?[_\.](\w+)(?: |;|$)(.*)$/gm, '.should$1_$2($3)').
replace(/([\/\s]*)(.+?)\.(should(?:[_\.]not)?)[_\.](\w+)\((.*)\)\s*;?$/gm, '$1 expect($2).$3($4, $5)').
replace(/, \)/g, ')').
replace(/should\.not/g, 'should_not')
},



range : function(start, end) {
var current = parseInt(start), end = parseInt(end), values = [current]
if (end > current) while (++current <= end) values.push(current)
else               while (--current >= end) values.push(current)
return '[' + values + ']'
},



report : function() {
this.duration = Number(new Date) - this.start
hook('reporting', JSpec.options)
new (JSpec.options.reporter || JSpec.reporters.DOM)(JSpec, JSpec.options)
},



run : function(options) {
if (any(hook('running'), haveStopped)) return this
if (options) extend(this.options, options)
this.start = Number(new Date)
each(this.suites, function(suite) { JSpec.runSuite(suite) })
return this
},



runSuite : function(suite) {
this.currentSuite = suite
this.evalBody(suite.body)
suite.ran = true
hook('beforeSuite', suite), suite.hook('before')
each(suite.specs, function(spec) {
hook('beforeSpec', spec)
suite.hook('before_each')
JSpec.runSpec(spec)
hook('afterSpec', spec)
suite.hook('after_each')
})
if (suite.hasSuites()) {
each(suite.suites, function(suite) {
JSpec.runSuite(suite)
})
}
hook('afterSuite', suite), suite.hook('after')
this.stats.suitesFinished++
},



fail : function(message) {
JSpec.currentSpec.fail(message)
},



pass : function(message) {
JSpec.currentSpec.pass(message)
},



runSpec : function(spec) {
this.currentSpec = spec
try { this.evalBody(spec.body) }
catch (e) { fail(e) }
spec.runDeferredAssertions()
destub()
this.stats.specsFinished++
this.stats.assertions += spec.assertions.length
},



requires : function(dependency, message) {
hook('requiring', dependency, message)
try { eval(dependency) }
catch (e) { throw 'JSpec depends on ' + dependency + ' ' + message }
return this
},



query : function(key, queryString) {
var queryString = (queryString || (main.location ? main.location.search : null) || '').substring(1)
return inject(queryString.split('&'), null, function(value, pair){
parts = pair.split('=')
return parts[0] == key ? parts[1].replace(/%20|\+/gmi, ' ') : value
})
},



error : function(message, e) {
