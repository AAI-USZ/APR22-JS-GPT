

var EventEmitter = require('events').EventEmitter
, ObjectId = require('./types/objectid')



exports.toCollectionName = function (name) {
if ('system.profile' === name) return name;
if ('system.indexes' === name) return name;
return pluralize(name.toLowerCase());
};



var rules = [
[/(m)an$/gi, '$1en'],
[/(pe)rson$/gi, '$1ople'],
[/(child)$/gi, '$1ren'],
[/^(ox)$/gi, '$1en'],
[/(ax|test)is$/gi, '$1es'],
[/(octop|vir)us$/gi, '$1i'],
[/(alias|status)$/gi, '$1es'],
[/(bu)s$/gi, '$1ses'],
[/(buffal|tomat|potat)o$/gi, '$1oes'],
[/([ti])um$/gi, '$1a'],
[/sis$/gi, 'ses'],
[/(?:([^f])fe|([lr])f)$/gi, '$1$2ves'],
[/(hive)$/gi, '$1s'],
[/([^aeiouy]|qu)y$/gi, '$1ies'],
[/(x|ch|ss|sh)$/gi, '$1es'],
[/(matr|vert|ind)ix|ex$/gi, '$1ices'],
[/([m|l])ouse$/gi, '$1ice'],
[/(quiz)$/gi, '$1zes'],
[/s$/gi, 's'],
[/$/gi, 's']
];



var uncountables = [
'advice',
'energy',
'excretion',
'digestion',
'cooperation',
'health',
'justice',
'labour',
'machinery',
'equipment',
'information',
'pollution',
'sewage',
'paper',
'money',
'species',
'series',
'rain',
'rice',
'fish',
'sheep',
'moose',
'deer',
'news'
];



function pluralize (str) {
var rule, found;
if (!~uncountables.indexOf(str.toLowerCase())){
found = rules.filter(function(rule){
return str.match(rule[0]);
});
if (found[0]) return str.replace(found[0][0], found[0][1]);
}
return str;
};



var Events = EventEmitter;

if (!('once' in EventEmitter.prototype)){

Events = function () {
EventEmitter.apply(this, arguments);
};



Events.prototype.__proto__ = EventEmitter.prototype;



Events.prototype.once = function (type, listener) {
var self = this;
self.on(type, function g(){
self.removeListener(type, g);
listener.apply(this, arguments);
});
};

}

exports.EventEmitter = Events;


exports.deepEqual = function deepEqual (a, b) {
if (a === b) return true;

if (a instanceof Date && b instanceof Date)
return a.getTime() === b.getTime();

if (a instanceof ObjectId && b instanceof ObjectId) {
return a.toString() === b.toString();
}

if (typeof a !== 'object' && typeof b !== 'object')
return a == b;

if (a === null || b === null || a === undefined || b === undefined)
return false

if (a.prototype !== b.prototype) return false;

try {
var ka = Object.keys(a),
kb = Object.keys(b),
key, i;
} catch (e) {
return false;
}



if (ka.length != kb.length)
return false;

ka.sort();
kb.sort();

for (i = ka.length - 1; i >= 0; i--) {
if (ka[i] != kb[i])
return false;
}


for (i = ka.length - 1; i >= 0; i--) {
key = ka[i];
if (!deepEqual(a[key], b[key])) return false;
}


if (a.valueOf && b.valueOf && a.valueOf() !== b.valueOf()) {
return false;
}

return true;
};



var clone = exports.clone = function (obj, shouldMinimizeData) {
if (obj === undefined || obj === null)
return obj

if (Array.isArray(obj))
return cloneArray(obj, shouldMinimizeData);

if (obj.toObject)
return obj.toObject();

if (obj.constructor == Object)
return cloneObject(obj, shouldMinimizeData);

if (obj.constructor == Date || obj.constructor == Function)
return new obj.constructor(+obj);

if (obj.constructor == RegExp)
return new RegExp(obj.source);

if (obj instanceof ObjectId)
return ObjectId.fromString(ObjectId.toString(obj));

if (obj.valueOf)
return obj.valueOf();
};

function cloneObject (obj, shouldMinimizeData) {
var ret = {}
, val
, hasKeys
, keys = Object.keys(obj)
, i = keys.length
, key

while (i--) {
key = keys[i];
val = clone(obj[key], shouldMinimizeData);

if (!shouldMinimizeData || ('undefined' !== typeof val)) {
if (!hasKeys) hasKeys = true;
ret[key] = val;
}
}

return shouldMinimizeData
? hasKeys && ret
: ret;
};

function cloneArray (arr, shouldMinimizeData) {
var ret = [];
for (var i = 0, l = arr.length; i < l; i++)
ret.push(clone(arr[i], shouldMinimizeData));
return ret;
};



exports.options = function (defaults, options) {
var keys = Object.keys(defaults)
, i = keys.length
, k ;

options = options || {};

while (i--) {
k = keys[i];
if (!(k in options)) {
options[k] = defaults[k];
}
}

return options;
};



exports.random = function () {
return Math.random().toString().substr(3);
};

exports.inGroupsOf = function inGroupsOf (card, arr, fn) {
var group = [];
for (var i = 0, l = arr.length; i < l; i++) {
if (i && i % card === 0) {
fn.apply(this, group);
group.length = 0;
}
group.push(arr[i]);
}
fn.apply(this, group);
};



exports.merge = function merge (to, from) {
var keys = Object.keys(from)
, i = keys.length
, key

while (i--) {
key = keys[i];
if ('undefined' === typeof to[key]) {
to[key] = from[key];
} else {
merge(to[key], from[key]);
}
}
};



exports.args = function (args, slice, sliceEnd) {
var ret = [];
var start = slice || 0;
var end = 3 === arguments.length
? sliceEnd
: args.length;

for (var i = start; i < end; ++i) {
ret[i - start] = args[i];
}

return ret;
}
