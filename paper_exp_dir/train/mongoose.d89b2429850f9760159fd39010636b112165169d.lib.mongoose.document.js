


var EventEmitter = require('events').EventEmitter
, MongooseError = require('./error')
, MixedSchema = require('./schema/mixed')
, Schema = require('./schema')
, ValidatorError = require('./schematype').ValidatorError
, utils = require('./utils')
, clone = utils.clone
, inspect = require('util').inspect
, StateMachine = require('./statemachine')
, ActiveRoster = StateMachine.ctor('require', 'modify', 'init')
, deepEqual = utils.deepEqual
, hooks = require('hooks');



function Document (obj) {
this._doc = this.buildDoc();
this._activePaths = new ActiveRoster();
var self = this;
this.schema.requiredPaths.forEach(function (path) {
self._activePaths.require(path);
});
this._saveError = null;
this._validationError = null;
this.isNew = true;
if (obj) this.set(obj);
this.registerHooks();
this.doQueue();
this.errors = undefined;
};



Document.prototype.__proto__ = EventEmitter.prototype;



Document.prototype.base;



Document.prototype.schema;



Document.prototype.isNew;



Document.prototype.errors;



Document.prototype.buildDoc = function () {
var doc = {}
, self = this;

this.schema.eachPath(function (i, type) {
var path = i.split('.')
, len = path.length;

path.reduce( function (ref, piece, i) {
var _default;
if (i === len-1) {
_default = type.getDefault(self);
if ('undefined' !== typeof _default)
ref[piece] = _default;
} else
return ref[piece] || (ref[piece] = {});
}, doc);
});

return doc;
};



Document.prototype.init = function (doc, fn) {
var self = this;
this.isNew = false;

function init (obj, doc, prefix) {
prefix = prefix || '';

var keys = Object.keys(obj)
, len = keys.length
, i;

while (len--) {
i = keys[len];
var path = prefix + i
, schema = self.schema.path(path);

if (!schema && obj[i] && obj[i].constructor == Object) {

doc[i] = {};
init(obj[i], doc[i], path + '.');
} else {
if (obj[i] === null) {
doc[i] = null;
} else if (obj[i] !== undefined) {
if (schema) {
self.try(function(){
doc[i] = schema.cast(obj[i], self, true);
});
} else {
doc[i] = obj[i];
}
}

self._activePaths.init(path);
}
}
};

init(doc, self._doc);

this.emit('init');

if (fn)
fn(null);

return this;
};


for (var k in hooks) {
Document.prototype[k] = Document[k] = hooks[k];
}



Document.prototype.set = function (path, val, type) {
var adhocs;
if (type) {
adhocs = this._adhocPaths || (this._adhocPaths = {});
adhocs[path] = Schema.interpretAsType(path, type);
}

if ('string' !== typeof path) {

if (null === path || undefined === path)
return this.set(val, path);

var prefix = val
? val + '.'
: '';

if (path instanceof Document) {
path = path._doc;
}

var keys = Object.keys(path);
var i = keys.length;
var key;

while (i--) {
key = keys[i];
if (!(this._path(prefix + key) instanceof MixedSchema)
&& undefined !== path[key]
&& null !== path[key]
&& Object == path[key].constructor) {
this.set(path[key], prefix + key);
} else if (undefined !== path[key]) {
this.set(prefix + key, path[key]);
}
}

return this;
}

var schema = this._path(path)
, parts = path.split('.')
, obj = this._doc
, self = this;

if (this.schema.pathType(path) === 'virtual') {
schema = this.schema.virtualpath(path);
schema.applySetters(val, this);
return this;
}



var pathToMark
, subpaths
, subpath;

if (parts.length <= 1) {
pathToMark = path;
} else {
subpaths = parts.map(function (part, i) {
return parts.slice(0, i).concat(part).join('.');
});

for (var i = 0, l = subpaths.length; i < l; i++) {
subpath = subpaths[i];
if (this.isDirectModified(subpath)

|| this.get(subpath) === null) {
pathToMark = subpath;
break;
}
}

if (!pathToMark) pathToMark = path;
}

var markedModified = this.isDirectModified(pathToMark);

if ((!schema || null === val || undefined === val) ||
this.try(function(){
val = schema.applySetters(schema.cast(val, self), self);
})) {

var priorVal = this.get(path);

if (!markedModified && !deepEqual(val, priorVal)) {
this._activePaths.modify(pathToMark);
}

for (var i = 0, l = parts.length; i < l; i++) {
var next = i + 1
, last = next === l;

if (last) {
obj[parts[i]] = val;
} else {

if (obj[parts[i]] && obj[parts[i]].constructor === Object) {
obj = obj[parts[i]];
} else {
obj = obj[parts[i]] = {};
}
}
}
}

return this;
};



Document.prototype.getValue = function (path) {
var parts = path.split('.')
, obj = this._doc
, part;

for (var i = 0, l = parts.length; i < l-1; i++) {
part = parts[i];
path = convertIfInt(path);
obj = obj.getValue
? obj.getValue(part)
: obj[part];
if (!obj) return obj;
}

part = parts[l-1];
path = convertIfInt(path);

return obj.getValue
? obj.getValue(part)
: obj[part];
};

function convertIfInt (string) {
if (/^\d+$/.test(string)) {
return parseInt(string, 10);
}
return string;
}



Document.prototype.setValue = function (path, val) {
var parts = path.split('.')
, obj = this._doc;

for (var i = 0, l = parts.length; i < l-1; i++) {
obj = obj[parts[i]];
}

obj[parts[l-1]] = val;
return this;
};



Document.prototype.doCast = function (path) {
var schema = this.schema.path(path);
if (schema)
this.setValue(path, this.getValue(path));
};



Document.prototype.get = function (path, type) {
var adhocs;
if (type) {
adhocs = this._adhocPaths || (this._adhocPaths = {});
adhocs[path] = Schema.interpretAsType(path, type);
}

var schema = this._path(path) || this.schema.virtualpath(path)
, pieces = path.split('.')
, obj = this._doc;

for (var i = 0, l = pieces.length; i < l; i++) {
obj = null == obj ? null : obj[pieces[i]];
}

if (schema) {
obj = schema.applyGetters(obj, this);
}

return obj;
};



Document.prototype._path = function (path, obj) {
var adhocs = this._adhocPaths
, adhocType = adhocs && adhocs[path];

if (adhocType) {
return adhocType;
} else {
return this.schema.path(path);
}
};



Document.prototype.commit =
Document.prototype.markModified = function (path) {
this._activePaths.modify(path);
};



Document.prototype.try = function (fn, scope) {
var res;
try {
fn.call(scope);
res = true;
} catch (e) {
this.error(e);
res = false;
}
return res;
};



Document.prototype.isModified = function (path) {
var directModifiedPaths = Object.keys(this._activePaths.states.modify);

var allPossibleChains = directModifiedPaths.reduce(function (list, path) {
var parts = path.split('.');
return list.concat(parts.reduce(function (chains, part, i) {
return chains.concat(parts.slice(0, i).concat(part).join('.'));
}, []));
}, []);

return !!~allPossibleChains.indexOf(path);
};



Document.prototype.isDirectModified = function (path) {
return (path in this._activePaths.states.modify);
};



Document.prototype.isInit = function (path) {
return (path in this._activePaths.states.init);
};



Document.prototype.validate = function (next) {
var total = 0
, self = this
, validating = {}

if (!this._activePaths.some('require', 'init', 'modify')) {
return complete();
}

function complete () {
next(self._validationError);
self._validationError = null;
}

this._activePaths.forEach('require', 'init', 'modify', function validatePath (path) {
if (validating[path]) return;

validating[path] = true;
total++;

process.nextTick(function(){
var p = self.schema.path(path);
if (!p) return --total || complete();

p.doValidate(self.getValue(path), function (err) {
if (err) {
self.invalidate(path, err);
}
--total || complete();
}, self);
});
});

return this;
};



Document.prototype.invalidate = function (path, err) {
if (!this._validationError) {
this._validationError = new ValidationError(this);
}

if (!err || 'string' === typeof err) {
err = new ValidatorError(path, err);
}

this._validationError.errors[path] = err;
}



Document.prototype.__defineGetter__('modified', function () {
return this._activePaths.some('modify');
});

function compile (tree, proto, prefix) {
var keys = Object.keys(tree)
, i = keys.length
, limb
, key;

while (i--) {
key = keys[i];
limb = tree[key];

define(key
, ((limb.constructor == Object
&& Object.keys(limb).length)
&& (!limb.type || limb.type.type)
? limb
: null)
, proto
, prefix
, keys);
}
};



function define (prop, subprops, prototype, prefix, keys) {
var prefix = prefix || ''
, path = (prefix ? prefix + '.' : '') + prop;

if (subprops) {

Object.defineProperty(prototype, prop, {
enumerable: true
, get: function () {
if (!this.__getters)
this.__getters = {};

if (!this.__getters[path]) {
var nested = Object.create(this);


if (!prefix) nested._scope = this;



var i = 0
, len = keys.length;

for (; i < len; ++i) {

Object.defineProperty(nested, keys[i], {
enumerable: false
, writable: true
, configurable: true
, value: undefined
});
}

nested.toObject = function () {
return this.get(path);
};

compile(subprops, nested, path);
this.__getters[path] = nested;
}

return this.__getters[path];
}
, set: function (v) {
return this.set(v, path);
}
});

} else {

Object.defineProperty(prototype, prop, {
enumerable: true
, get: function ( ) { return this.get.call(this._scope || this, path); }
, set: function (v) { return this.set.call(this._scope || this, path, v); }
});
}
};



Document.prototype.__defineSetter__('schema', function (schema) {
compile(schema.tree, this);
this._schema = schema;
});



Document.prototype.__defineGetter__('schema', function () {
return this._schema;
});



Document.prototype.registerHooks = function () {
var self = this;

if (!this.save) return;

this.pre('save', function checkForExistingErrors (next) {
if (self._saveError){
next(self._saveError);
self._saveError = null;
} else {
next();
}
}, function (err) {
this.db.emit('error', err);
}).pre('save', function validation (next) {
return self.validate.call(self, next);
});
};



Document.prototype.error = function (err) {
this._saveError = err;
return this;
};



Document.prototype.doQueue = function () {
if (this.schema && this.schema.callQueue)
for (var i = 0, l = this.schema.callQueue.length; i < l; i++) {
this[this.schema.callQueue[i][0]].apply(this, this.schema.callQueue[i][1]);
}
return this;
};



Document.prototype.toObject = function (ref) {
if (ref) return this._doc;
return clone(this._doc, true);
};



Document.prototype.toJSON = function () {
return this.toObject();
};



Document.prototype.inspect = function () {
return inspect(this.toObject(true));
};



Document.prototype.equals = function (doc) {
return this.get('_id') === doc.get('_id');
};



module.exports = Document;



function ValidationError (instance) {
MongooseError.call(this, "Validation failed");
Error.captureStackTrace(this, arguments.callee);
this.name = 'ValidationError';
this.errors = instance.errors = {};
};

ValidationError.prototype.toString = function () {
return this.name + ': ' + Object.keys(this.errors).map(function (key) {
return String(this.errors[key]);
}, this).join(', ');
};



ValidationError.prototype.__proto__ = MongooseError.prototype;

Document.ValidationError = ValidationError;



function DocumentError () {
MongooseError.call(this, msg);
Error.captureStackTrace(this, arguments.callee);
this.name = 'DocumentError';
};



DocumentError.prototype.__proto__ = MongooseError.prototype;

exports.Error = DocumentError;
