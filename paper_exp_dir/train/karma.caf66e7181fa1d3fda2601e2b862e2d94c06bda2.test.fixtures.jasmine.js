var isCommonJS = typeof window == "undefined";


var jasmine = {};
if (isCommonJS) exports.jasmine = jasmine;

jasmine.unimplementedMethod_ = function() {
throw new Error("unimplemented method");
};


jasmine.undefined = jasmine.___undefined___;


jasmine.VERBOSE = false;


jasmine.DEFAULT_UPDATE_INTERVAL = 250;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

jasmine.getGlobal = function() {
function getGlobal() {
return this;
}

return getGlobal();
};


jasmine.bindOriginal_ = function(base, name) {
var original = base[name];
if (original.apply) {
return function() {
return original.apply(base, arguments);
};
} else {

return jasmine.getGlobal()[name];
}
};

jasmine.setTimeout = jasmine.bindOriginal_(jasmine.getGlobal(), 'setTimeout');
jasmine.clearTimeout = jasmine.bindOriginal_(jasmine.getGlobal(), 'clearTimeout');
jasmine.setInterval = jasmine.bindOriginal_(jasmine.getGlobal(), 'setInterval');
jasmine.clearInterval = jasmine.bindOriginal_(jasmine.getGlobal(), 'clearInterval');

jasmine.MessageResult = function(values) {
this.type = 'log';
this.values = values;
this.trace = new Error();
};

jasmine.MessageResult.prototype.toString = function() {
var text = "";
for (var i = 0; i < this.values.length; i++) {
if (i > 0) text += " ";
if (jasmine.isString_(this.values[i])) {
text += this.values[i];
} else {
text += jasmine.pp(this.values[i]);
}
}
return text;
};

jasmine.ExpectationResult = function(params) {
this.type = 'expect';
this.matcherName = params.matcherName;
this.passed_ = params.passed;
this.expected = params.expected;
this.actual = params.actual;
this.message = this.passed_ ? 'Passed.' : params.message;

var trace = (params.trace || new Error(this.message));
this.trace = this.passed_ ? '' : trace;
};

jasmine.ExpectationResult.prototype.toString = function () {
return this.message;
};

jasmine.ExpectationResult.prototype.passed = function () {
return this.passed_;
};


jasmine.getEnv = function() {
var env = jasmine.currentEnv_ = jasmine.currentEnv_ || new jasmine.Env();
return env;
};


jasmine.isArray_ = function(value) {
return jasmine.isA_("Array", value);
};


jasmine.isString_ = function(value) {
return jasmine.isA_("String", value);
};


jasmine.isNumber_ = function(value) {
return jasmine.isA_("Number", value);
};


jasmine.isA_ = function(typeName, value) {
return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
};


jasmine.pp = function(value) {
var stringPrettyPrinter = new jasmine.StringPrettyPrinter();
stringPrettyPrinter.format(value);
return stringPrettyPrinter.string;
};


jasmine.isDomNode = function(obj) {
return obj.nodeType > 0;
};


jasmine.any = function(clazz) {
return new jasmine.Matchers.Any(clazz);
};


jasmine.objectContaining = function (sample) {
return new jasmine.Matchers.ObjectContaining(sample);
};


jasmine.Spy = function(name) {

this.identity = name || 'unknown';

this.isSpy = true;

this.plan = function() {
};

this.mostRecentCall = {};


this.argsForCall = [];
this.calls = [];
};


jasmine.Spy.prototype.andCallThrough = function() {
this.plan = this.originalValue;
return this;
};


jasmine.Spy.prototype.andReturn = function(value) {
this.plan = function() {
return value;
};
return this;
};


jasmine.Spy.prototype.andThrow = function(exceptionMsg) {
this.plan = function() {
throw exceptionMsg;
};
return this;
};


jasmine.Spy.prototype.andCallFake = function(fakeFunc) {
this.plan = fakeFunc;
return this;
};


jasmine.Spy.prototype.reset = function() {
this.wasCalled = false;
this.callCount = 0;
this.argsForCall = [];
this.calls = [];
this.mostRecentCall = {};
};

jasmine.createSpy = function(name) {

var spyObj = function() {
spyObj.wasCalled = true;
spyObj.callCount++;
var args = jasmine.util.argsToArray(arguments);
spyObj.mostRecentCall.object = this;
spyObj.mostRecentCall.args = args;
spyObj.argsForCall.push(args);
spyObj.calls.push({object: this, args: args});
return spyObj.plan.apply(this, arguments);
};

var spy = new jasmine.Spy(name);

for (var prop in spy) {
spyObj[prop] = spy[prop];
}

spyObj.reset();

return spyObj;
};


jasmine.isSpy = function(putativeSpy) {
return putativeSpy && putativeSpy.isSpy;
};


jasmine.createSpyObj = function(baseName, methodNames) {
if (!jasmine.isArray_(methodNames) || methodNames.length === 0) {
throw new Error('createSpyObj requires a non-empty array of method names to create spies for');
}
var obj = {};
for (var i = 0; i < methodNames.length; i++) {
obj[methodNames[i]] = jasmine.createSpy(baseName + '.' + methodNames[i]);
}
return obj;
};


jasmine.log = function() {
var spec = jasmine.getEnv().currentSpec;
spec.log.apply(spec, arguments);
};


var spyOn = function(obj, methodName) {
return jasmine.getEnv().currentSpec.spyOn(obj, methodName);
};
if (isCommonJS) exports.spyOn = spyOn;


var it = function(desc, func) {
return jasmine.getEnv().it(desc, func);
};
if (isCommonJS) exports.it = it;


var iit = function(desc, func) {
return jasmine.getEnv().iit(desc, func);
};
if (isCommonJS) exports.iit = iit;


var xit = function(desc, func) {
return jasmine.getEnv().xit(desc, func);
};
if (isCommonJS) exports.xit = xit;


var expect = function(actual) {
return jasmine.getEnv().currentSpec.expect(actual);
};
if (isCommonJS) exports.expect = expect;


var runs = function(func) {
