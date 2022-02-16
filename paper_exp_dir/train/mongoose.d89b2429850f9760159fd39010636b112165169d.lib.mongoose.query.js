var utils = require('./utils')
, merge = utils.merge
, Promise = require('./promise')
, Document = require('./document')
, inGroupsOf = utils.inGroupsOf;



function Query (criteria, options) {
options = this.options = options || {};
this.safe = options.safe


var pop = this.options.populate;
this.options.populate = {};

if (pop && Array.isArray(pop)) {
for (var i = 0, l = pop.length; i < l; i++) {
this.options.populate[pop[i]] = [];
}
}

this._conditions = {};
if (criteria) this.find(criteria);
}



Query.prototype.bind = function bind (model, op, updateArg) {
this.model = model;
this.op = op;
if (op === 'update') this._updateArg = updateArg;
return this;
};



Query.prototype.run =
Query.prototype.exec = function (op, callback) {
var promise = new Promise();

switch (typeof op) {
case 'function':
callback = op;
op = null;
break;
case 'string':
this.op = op;
break;
}

if (callback) promise.addBack(callback);

if (!this.op) {
promise.complete();
return promise;
}

if ('update' == this.op) {
this.update(this._updateArg, promise.resolve.bind(promise));
return promise;
}

if ('distinct' == this.op) {
this.distinct(this._distinctArg, promise.resolve.bind(promise));
return promise;
}

this[this.op](promise.resolve.bind(promise));
return promise;
};

Query.prototype.find = function (criteria, callback) {
this.op = 'find';
if ('function' === typeof criteria) {
callback = criteria;
criteria = {};
} else if (criteria instanceof Query) {

merge(this._conditions, criteria._conditions);
} else if (criteria instanceof Document) {
merge(this._conditions, criteria.toObject());
} else {
merge(this._conditions, criteria);
}
if (!callback) return this;
return this.execFind(callback);
};



Query.prototype.cast = function (model, obj) {
obj || (obj= this._conditions);

var schema = model.schema
, paths = Object.keys(obj)
, i = paths.length
, any$conditionals
, schematype
, nested
, path
, type
, val;

while (i--) {
path = paths[i];
val = obj[path];

if (path === '$or') {
var k = val.length
, orComponentQuery;

while (k--) {
orComponentQuery = new Query(val[k]);
orComponentQuery.cast(model);
val[k] = orComponentQuery._conditions;
}

} else if (path === '$where') {
type = typeof val;

if ('string' !== type && 'function' !== type) {
throw new Error("Must have a string or function for $where");
}

if ('function' === type) {
obj[path] = val.toString();
}

continue;

} else {
schematype = schema.path(path);

if (!schematype) {

var split = path.split('.')
, j = split.length
, pathFirstHalf
, pathLastHalf
, remainingConds
, castingQuery;


while (j--) {
pathFirstHalf = split.slice(0, j).join('.');
schematype = schema.path(pathFirstHalf);
if (schematype) break;
}


if (schematype) {

if (schematype.caster && schematype.caster.schema) {
remainingConds = {};
pathLastHalf = split.slice(j).join('.');
remainingConds[pathLastHalf] = val;
castingQuery = new Query(remainingConds);
castingQuery.cast(schematype.caster);
obj[path] = castingQuery._conditions[pathLastHalf];
} else {
obj[path] = val;
}
}

} else if (val === null || val === undefined) {
continue;
} else if (val.constructor == Object) {

any$conditionals = Object.keys(val).some(function (k) {
return k.charAt(0) === '$';
});

if (!any$conditionals) {
obj[path] = schematype.castForQuery(val);
} else {

var ks = Object.keys(val)
, k = ks.length
, $cond;

while (k--) {
$cond = ks[k];
nested = val[$cond];

if ('$exists' === $cond) {
if ('boolean' !== typeof nested) {
throw new Error("$exists parameter must be Boolean");
}
continue;
}

if ('$not' === $cond) {
this.cast(model, val[$cond]);
} else {
val[$cond] = schematype.castForQuery($cond, nested);
}
}
}
} else {
obj[path] = schematype.castForQuery(val);
}
}
}
};

Query.prototype._optionsForExec = function (model) {
var options = utils.clone(this.options);
if (! ('safe' in options)) options.safe = model.options.safe;
return options;
};



Query.prototype.$where = function (js) {
this._conditions['$where'] = js;
return this;
};



Query.prototype.where = function (path, val) {
var conds;
if (arguments.length === 2) {
this._conditions[path] = val;
}
this._currPath = path;
return this;
};


'gt gte lt lte ne in nin all size maxDistance'.split(' ').forEach( function ($conditional) {
Query.prototype['$' + $conditional] =
Query.prototype[$conditional] = function (path, val) {
if (arguments.length === 1) {
val = path;
path = this._currPath
}
var conds = this._conditions[path] || (this._conditions[path] = {});
conds['$' + $conditional] = val;
return this;
};
});

Query.prototype.notEqualTo = Query.prototype.ne;

;['mod', 'near'].forEach( function ($conditional) {
Query.prototype['$' + $conditional] =
Query.prototype[$conditional] = function (path, val) {
if (arguments.length === 1) {
val = path;
path = this._currPath
} else if (arguments.length === 2 && !Array.isArray(val)) {
val = utils.args(arguments);
path = this._currPath;
} else if (arguments.length === 3) {
val = utils.args(arguments, 1);
}
var conds = this._conditions[path] || (this._conditions[path] = {});
conds['$' + $conditional] = val;
return this;
};
});

Query.prototype['$exists'] =
Query.prototype.exists = function (path, val) {
if (arguments.length === 0) {
path = this._currPath
val = true;
} else if (arguments.length === 1) {
if ('boolean' === typeof path) {
val = path;
path = this._currPath;
} else {
val = true;
}
}
var conds = this._conditions[path] || (this._conditions[path] = {});
conds['$exists'] = val;
return this;
};

Query.prototype['$elemMatch'] =
Query.prototype.elemMatch = function (path, criteria) {
var block;
if (path.constructor === Object) {
criteria = path;
path = this._currPath;
} else if ('function' === typeof path) {
block = path;
path = this._currPath;
} else if (criteria.constructor === Object) {
} else if ('function' === typeof criteria) {
block = criteria;
} else {
throw new Error("Argument error");
}
var conds = this._conditions[path] || (this._conditions[path] = {});
if (block) {
criteria = new Query();
block(criteria);
conds['$elemMatch'] = criteria._conditions;
} else {
conds['$elemMatch'] = criteria;
}
return this;
};

;['maxscan'].forEach( function (method) {
Query.prototype[method] = function (v) {
this.options[method] = v;
return this;
};
});


Query.prototype.explain = function () {
throw new Error("Unimplemented");
};









;['wherein', '$wherein'].forEach(function (getter) {
Object.defineProperty(Query.prototype, getter, {
get: function () {
return this;
}
});
});

Query.prototype['$box'] =
Query.prototype.box = function (path, val) {
if (arguments.length === 1) {
val = path;
path = this._currPath;
}
var conds = this._conditions[path] || (this._conditions[path] = {});
conds['$wherein'] = { '$box': [val.ll, val.ur]  };
return this;
};

Query.prototype['$center'] =
Query.prototype.center = function (path, val) {
if (arguments.length === 1) {
val = path;
path = this._currPath;
}
var conds = this._conditions[path] || (this._conditions[path] = {});
conds['$wherein'] = { '$center': [val.center, val.radius]  };
return this;
};



Query.prototype.select =
Query.prototype.fields = function () {
var arg0 = arguments[0];
if (!arg0) return this;
if (arg0.constructor === Object || Array.isArray(arg0)) {
this._applyFields(arg0);
} else if (arguments.length === 1 && typeof arg0 === 'string') {
this._applyFields({only: arg0});
} else {
this._applyFields({only: this._parseOnlyExcludeFields.apply(this, arguments)});
}
return this;
};



Query.prototype.only = function (fields) {
fields = this._parseOnlyExcludeFields.apply(this, arguments);
this._applyFields({ only: fields });
return this;
};



Query.prototype.exclude = function (fields) {
fields = this._parseOnlyExcludeFields.apply(this, arguments);
this._applyFields({ exclude: fields });
return this;
};

Query.prototype['$slice'] =
Query.prototype.slice = function (path, val) {
if (arguments.length === 1) {
val = path;
path = this._currPath
} else if (arguments.length === 2) {
if ('number' === typeof path) {
val = [path, val];
path = this._currPath;
}
} else if (arguments.length === 3) {
val = utils.args(arguments, 1);
}
var myFields = this._fields || (this._fields = {});
myFields[path] = { '$slice': val };
return this;
};



Query.prototype._parseOnlyExcludeFields = function (fields) {
if (1 === arguments.length && 'string' === typeof fields) {
fields = fields.split(' ');
} else if (Array.isArray(fields)) {

} else {
fields = utils.args(arguments);
}
return fields;
};



Query.prototype._applyFields = function (fields) {
var $fields
, pathList;

if (Array.isArray(fields)) {
$fields = fields.reduce(function ($fields, field) {
$fields[field] = 1;
return $fields;
}, {});
} else if (pathList = fields.only || fields.exclude) {
$fields =
this._parseOnlyExcludeFields(pathList)
.reduce(function ($fields, field) {
$fields[field] = fields.only ? 1: 0;
return $fields;
}, {});
} else if (fields.constructor === Object) {
$fields = fields;
} else {
throw new Error("fields is invalid");
}

var myFields = this._fields || (this._fields = {});
for (var k in $fields) myFields[k] = $fields[k];
};



Query.prototype.sort = function () {
var sort = this.options.sort || (this.options.sort = []);

inGroupsOf(2, arguments, function (field, value) {
sort.push([field, value]);
});

return this;
};

Query.prototype.asc = function () {
var sort = this.options.sort || (this.options.sort = []);
for (var i = 0, l = arguments.length; i < l; i++) {
sort.push([arguments[i], 1]);
}
return this;
};

Query.prototype.desc = function () {
var sort = this.options.sort || (this.options.sort = []);
for (var i = 0, l = arguments.length; i < l; i++) {
sort.push([arguments[i], -1]);
}
return this;
};

;['limit', 'skip', 'maxscan', 'snapshot'].forEach( function (method) {
Query.prototype[method] = function (v) {
this.options[method] = v;
return this;
};
});



Query.prototype.hint = function (v, multi) {
var hint = this.options.hint || (this.options.hint = {})
, k

if (multi) {
inGroupsOf(2, arguments, function (field, val) {
hint[field] = val;
});
} else if (v.constructor === Object) {

for (k in v) {
hint[k] = v[k];
}
}

return this;
};



Query.prototype.slaveOk = function (v) {
this.options.slaveOk = arguments.length ? !!v : true;
return this;
};

Query.prototype.execFind = function (callback) {
var model = this.model
, options = this._optionsForExec(model)
, self = this

options.fields = this._fields;

var promise = new Promise(callback);

try {
this.cast(model);
} catch (err) {
return promise.error(err);
}

var castQuery = this._conditions;

model.collection.find(castQuery, options, function (err, cursor) {
if (err) return promise.error(err);

cursor.toArray(function (err, docs) {
if (err) return promise.error(err);

var arr = []
, count = docs.length;

if (!count) return promise.complete([]);

for (var i = 0, l = docs.length; i < l; i++) {
arr[i] = new model();
delete arr[i]._doc._id;

arr[i].init(docs[i], self, function (err) {
if (err) return promise.error(err);
--count || promise.complete(arr);
});
}
});
});

return this;
};



Query.prototype.each = function (callback) {
var model = this.model
, options = this._optionsForExec(model)
, manual = 3 == callback.length

options.fields = this._fields;

try {
this.cast(model);
} catch (err) {
return callback(err);
}

function complete (err, val) {
if (complete.ran) return;
complete.ran = true;
callback(err, val);
}

var self = this;

model.collection.find(this._conditions, options, function (err, cursor) {
if (err) return complete(err);

next();

function next () {


process.nextTick(function () {
cursor.nextObject(onNextObject);
});
}

function onNextObject (err, doc) {
if (err) return complete(err);


if (!doc) return complete(null, null);

var instance = new model;

delete instance._doc._id;

instance.init(doc, self, function (err) {
if (err) return complete(err);

if (manual) {
callback(null, instance, next);
} else {
callback(null, instance);
next();
}

});
}

});

return this;
}



Query.prototype.findOne = function (callback) {
this.op = 'findOne';
var model = this.model;
var options = this._optionsForExec(model);

options.fields = this._fields;

var promise = new Promise(callback);

try {
this.cast(model);
} catch (err) {
return promise.error(err);
}

var castQuery = this._conditions
, self = this

model.collection.findOne(castQuery, options, function (err, doc) {
if (err) return promise.error(err);
if (!doc) return promise.complete(null);

var casted = new model();
delete casted._doc._id;

casted.init(doc, self, function (err) {
if (err) return promise.error(err);
promise.complete(casted);
});
});

return this;
};



Query.prototype.count = function (callback) {
this.op = 'count';
var model = this.model;

try {
this.cast(model);
} catch (err) {
return callback(err);
}

var castQuery = this._conditions;
model.collection.count(castQuery, callback);
return this;
};



Query.prototype.distinct = function (field, callback) {
this.op = 'distinct';
var model = this.model;

try {
this.cast(model);
} catch (err) {
return callback(err);
}

var castQuery = this._conditions;
model.collection.distinct(field, castQuery, callback);
return this;
};



Query.prototype.update = function (doc, callback) {
this.op = 'update';
this._updateArg = doc;

var model = this.model
, options = this._optionsForExec(model)
, useSet = model.options['use$SetOnSave']
, castQuery
, castDoc

try {
this.cast(model);
castQuery = this._conditions;
} catch (err) {
return callback(err);
}

try {
castDoc = this._castUpdate(doc);
} catch (err) {
return callback(err);
}

model.collection.update(castQuery, castDoc, options, callback);
return this;
};



Query.prototype._castUpdate = function (obj) {
var schema = this.model.schema
, doc = new this.model
, paths = Object.keys(obj)
, i = paths.length
, subpaths
, subval
, method
, path
, val
, ii

while (i--) {
path = paths[i];
val = obj[path];

if ('$' !== path[0]) {
doc.set(path, val);
continue;

} else {
if (Object !== val.constructor) {
var msg = 'Invalid atomic update value for ' + path + '. '
+ 'Expected an object, received ' + typeof val;
throw new Error(msg);
}

subpaths = Object.keys(val)
ii = subpaths.length
method = path;

while (ii--) {
subpath = subpaths[ii];
subval = val[subpath];

if (schema.path(subpath)) {
if ('$set' === method) {
doc.set(subpath, subval);
continue;
}

var cur = doc.get(subpath);

if ('$inc' === method && !cur) {
doc.set(subpath, 0);
cur = doc.get(subpath);
}


if ('function' === typeof cur[method]) {
cur[method](subval);
}
}
}
}
}

var delta = doc._delta();
return delta;
};




Query.prototype.remove = function (callback) {
this.op = 'remove';

var model = this.model
, options = this._optionsForExec(model);

try {
this.cast(model);
} catch (err) {
return callback(err);
}

var castQuery = this._conditions;
model.collection.remove(castQuery, options, callback);
return this;
};



Query.prototype.populate = function (path, fields) {
this.options.populate[path] = fields || [];
return this;
};



module.exports = Query;
