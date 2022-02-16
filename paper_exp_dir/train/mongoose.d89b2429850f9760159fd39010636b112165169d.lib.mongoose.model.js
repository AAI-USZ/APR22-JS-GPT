


var Document = require('./document')
, MongooseArray = require('./types/array')
, DocumentArray = require('./types/documentarray')
, MongooseBuffer = require('./types/buffer')
, MongooseError = require('./error')
, Query = require('./query')
, utils = require('./utils')
, EventEmitter = utils.EventEmitter
, merge = utils.merge
, Promise = require('./promise');



function Model (doc) {
Document.call(this, doc);
};



Model.prototype.__proto__ = Document.prototype;



Model.prototype.db;



Model.prototype.collection;



Model.prototype.modelName;



Model.prototype.getPopulationKeys = function (query) {
var paths = {};

if (query && query.options.populate) {
for (var name in query.options.populate) {
var schema = this.schema.path(name);

if (!schema) {


var pieces = name.split('.')
, len = pieces.length;

for (var i = pieces.length; i > 0; i--) {
var path = pieces.slice(0, i).join('.')
, pathSchema = this.schema.path(path);


if (pathSchema && pathSchema.caster) {
if (!paths[path]) {
paths[path] = query.options.populate[name];
paths[path].sub = {};
}

paths[path].sub[pieces.slice(i).join('.')] = 1;
break;
}
}
} else {
paths[name] = query.options.populate[name];
}
}
}

return paths;
};



Model.prototype.populate = function (schema, oid, fields, fn) {
if (Array.isArray(oid)) {
if (oid.length) {
var total = oid.length
, model = this.model(schema.caster.options.ref)
, arr = []

oid.forEach(function (id, i) {

model.findById(id, fields, function (err, obj) {
if (err) return fn(err);
arr[i] = obj;
--total || fn(null, arr);
});
});
} else {
fn(null, oid);
}
} else {
this.model(schema.options.ref).findById(oid, fields, fn)
}
};



Model.prototype.init = function (doc, query, fn) {
if ('function' == typeof query) {
fn = query;
query = null;
}

var populate = this.getPopulationKeys(query)
, self = this;

if (!Object.keys(populate).length) {

return Document.prototype.init.call(this, doc, fn);
}

function error (err) {
if (fn.run) return;
fn.run = true;
fn(err);
}

function init (obj, prefix, fn) {
prefix = prefix || '';

var keys = Object.keys(obj)
, len = keys.length;

function next () {
if (--len < 0) return fn();

var i = keys[len]
, path = prefix + i
, schema = self.schema.path(path);

if (!schema && obj[i] && obj[i].constructor == Object) {

init(obj[i], path + '.', next);
} else {
if (obj[i] && schema && populate[path]) {
if (populate[path].sub) {
var total = 0;

obj[i].forEach(function (subobj) {
for (var key in populate[path].sub) {
if (subobj[key]) {
(function (key) {
total++;

self.populate(
schema.schema.path(key)
, subobj[key]
, populate[path]
, function (err, doc) {
if (err) return error(err);
subobj[key] = doc;
--total || next();
}
);
})(key);
}
}
});
} else {
self.populate(schema, obj[i], populate[path], function (err, doc) {
if (err) return error(err);
obj[i] = doc;
next();
});
}
} else {
next();
}
}
};

next();
};

init(doc, '', function (err) {
if (err) return fn(err);
Document.prototype.init.call(self, doc, fn);
});

return this;
};

function makeSaveHandler(promise, self) {
return function (err) {
if (err) return promise.error(err);
promise.complete(self);
self.emit('save', self);
promise = null;
self = null;
};
};



Model.prototype.save = function (fn) {
var promise = new Promise(fn)
, options = {}
, self = this
, complete = makeSaveHandler(promise, self);

if (this.options.safe) {
options.safe = true;
}

if (this.isNew) {

this.collection.insert(this.toObject(), options, complete);
this.isNew = false;


this._dirty().forEach(function (dirt) {
var type = dirt.value;
if (type && type._path && type.doAtomics) {
type._atomics = {};
}
});

} else {

var delta = this._delta();

if (Object.keys(delta).length) {
this.collection.update({ _id: this._doc._id }, delta, options, complete);
} else {
complete(null);
}
}


this._activePaths.clear('modify');
this.schema.requiredPaths.forEach(function (path) {
self._activePaths.require(path);
});
};



Model.prototype._dirty = function () {
var self = this;

return this._activePaths.map('modify', function (path) {
return { path: path
, value: self.getValue(path)
, schema: self._path(path) };
});
}



Model.prototype._delta = function () {

var self = this
, delta
, useSet = this.options['use$SetOnSave'];

return this._dirty().reduce(function (delta, data) {
var type = data.value
, schema = data.schema
, atomics, val, obj;

if (type === null || type === undefined) {
if (!('$set' in delta))
delta['$set'] = {};

delta['$set'][data.path] = type;
} else if (type._path && type.doAtomics) {

atomics = type._atomics;

var ops = Object.keys(atomics)
, i = ops.length
, op;

while (i--) {
op = ops[i]
if (op === '$pushAll' || op === '$pullAll') {
if (atomics[op].length === 1) {
val = atomics[op][0];
delete atomics[op];
op = op.replace('All', '');
atomics[op] = val;
}
}
val = atomics[op];
obj = delta[op] = delta[op] || {};
if (op === '$pull' || op === '$push') {
if (val.constructor !== Object) {
if (Array.isArray(val)) val = [val];

val = schema.cast(val)[0];
}
}
obj[data.path] = val.toObject
? val.toObject()
: Array.isArray(val)
? val.map(function (mem) {
return mem.toObject
? mem.toObject()
: mem.valueOf
? mem.valueOf()
: mem;
})
: val.valueOf
? val.valueOf()
: val;
}
type._atomics = {};
} else {

if (type instanceof MongooseArray ||
type instanceof MongooseBuffer) {
type = type.toObject();
} else if (type._path)
type = type.valueOf();

if (useSet) {
if (!('$set' in delta))
delta['$set'] = {};

delta['$set'][data.path] = type;
} else
delta[data.path] = type;
}

return delta;
}, {});
}



Model.prototype.remove = function (fn) {
if (this.removing || this.removed)
return this;

if (!this.removing) {
var promise = this.removing = new Promise(fn)
, self = this;

this.collection.remove({ _id: this._doc._id }, function (err) {
if (err) return promise.error(err);
promise.complete();
self.emit('remove');
});
}

return this;
};



Model.prototype.registerHooks = function () {

this.pre('save', function (next) {


var subdocs = 0
, error = false
, self = this;

var arrays = this._activePaths
.map('init', 'modify', function (i) {
return self.getValue(i);
})
.filter(function (val) {
return (val && val instanceof DocumentArray && val.length);
});

if (!arrays.length)
return next();

arrays.forEach(function (array) {
subdocs += array.length;
array.forEach(function (value) {
if (!error)
value.save(function (err) {
if (!error) {
if (err) {
error = true;
next(err);
} else
--subdocs || next();
}
});
});
});
}, function (err) {
this.db.emit('error', err);
});

Document.prototype.registerHooks.call(this);
};



Model.prototype.model = function (name) {
return this.db.model(name);
};



Model.prototype.__defineGetter__('options', function () {
return this.schema ? this.schema.options : {};
});



for (var i in EventEmitter.prototype)
Model[i] = EventEmitter.prototype[i];



Model.init = function () {

var self = this
, indexes = this.schema.indexes
, count = indexes.length;

indexes.forEach(function (index) {
self.collection.ensureIndex(index[0], index[1], function (err) {
if (err) return self.db.emit('error', err);
--count || self.emit('index');
});
});
};



Model.schema;



Model.db;



Model.collection;



['db', 'collection', 'schema', 'options'].forEach(function(prop){
Model.__defineGetter__(prop, function(){
return this.prototype[prop];
});
});



module.exports = exports = Model;

Model.remove = function (conditions, callback) {
if ('function' === typeof conditions) {
callback = conditions;
conditions = {};
}

var query = new Query(conditions).bind(this, 'remove');

if ('undefined' === typeof callback)
return query;

this._applyNamedScope(query);
return query.remove(callback);
};



Model.find = function (conditions, fields, options, callback) {
if ('function' == typeof conditions) {
callback = conditions;
conditions = {};
fields = null;
options = null;
} else if ('function' == typeof fields) {
callback = fields;
fields = null;
options = null;
} else if ('function' == typeof options) {
callback = options;
options = null;
}

var query = new Query(conditions, options).select(fields).bind(this, 'find');

if ('undefined' === typeof callback)
return query;

this._applyNamedScope(query);
return query.find(callback);
};



Model._applyNamedScope = function (query) {
var cQuery = this._cumulativeQuery;

if (cQuery) {
merge(query._conditions, cQuery._conditions);
if (query._fields && cQuery._fields)
merge(query._fields, cQuery._fields);
if (query.options && cQuery.options)
merge(query.options, cQuery.options);
delete this._cumulativeQuery;
}

return query;
}



Model.findById = function (id, fields, options, callback) {
return this.findOne({ _id: id }, fields, options, callback);
};



Model.findOne = function (conditions, fields, options, callback) {
if ('function' == typeof options) {





callback = options;
options = null;
} else if ('function' == typeof fields) {




callback = fields;
fields = null;
options = null;
} else if ('function' == typeof conditions) {
callback = conditions;
conditions = {};
fields = null;
options = null;
}

var query = new Query(conditions, options).select(fields).bind(this, 'findOne');

if ('undefined' == typeof callback)
return query;

this._applyNamedScope(query);
return query.findOne(callback);
};



Model.count = function (conditions, callback) {
var query = new Query(conditions).bind(this, 'count');
if ('undefined' == typeof callback)
return query;

this._applyNamedScope(query);
return query.count(callback);
};

Model.distinct = function (field, conditions, callback) {
var query = new Query(conditions).bind(this, 'distinct');
if ('undefined' == typeof callback) {
query._distinctArg = field;
return query;
}

this._applyNamedScope(query);
return query.distinct(field, callback);
};



Model.where = function (path, val) {
var q = new Query().bind(this, 'find');
return q.where.apply(q, arguments);
};



Model.$where = function () {
var q = new Query().bind(this, 'find');
return q.$where.apply(q, arguments);
};



Model.create = function (doc, fn) {
var args = utils.args(arguments)
, lastArg = args[args.length-1]
, docs = []
, count;

if (typeof lastArg === 'function') {
fn = args.pop();
}

count = args.length;
var self = this;

args.forEach(function (arg, i) {
var doc = new self(arg);
docs[i] = doc;
doc.save(function (err) {
if (err) return fn(err);
--count || fn.apply(null, [null].concat(docs));
});
});
};



Model.update = function (conditions, doc, options, callback) {
if (arguments.length < 4) {
if ('function' === typeof options) {

callback = options;
options = null;
} else if ('function' === typeof doc) {

callback = doc;
doc = conditions;
conditions = {};
options = null;
}
}

var query = new Query(conditions, options).bind(this, 'update', doc);

if ('undefined' == typeof callback)
return query;

this._applyNamedScope(query);
return query.update(doc, callback);
};



Model.compile = function (name, schema, collectionName, connection, base) {

function model () {
Model.apply(this, arguments);
};

model.modelName = name;
model.__proto__ = Model;
model.prototype.__proto__ = Model.prototype;
model.prototype.base = base;
model.prototype.schema = schema;
model.prototype.db = connection;
model.prototype.collection = connection.collection(collectionName);


for (var i in schema.methods)
model.prototype[i] = schema.methods[i];


for (var i in schema.statics)
model[i] = schema.statics[i];


if (schema.namedScopes) schema.namedScopes.compile(model);

return model;
};
