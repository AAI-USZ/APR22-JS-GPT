


var EventEmitter = require('events').EventEmitter
, VirtualType = require('./virtualtype')
, utils = require('./utils')
, NamedScope
, Query
, Types



function Schema (obj, options) {
this.paths = {};
this.virtuals = {};
this.inherits = {};
this.callQueue = [];
this._indexes = [];
this.methods = {};
this.statics = {};
this.tree = {};


this.options = utils.options({
safe: true
, 'use$SetOnSave': true
}, options);


if (obj)
this.add(obj);

if (!this.paths['_id'])
this.add({ _id: {type: ObjectId, auto: true} });

if (!this.paths['id'] && !this.options.noVirtualId) {
this.virtual('id').get(function () {
return this._id.toString();
});
}

delete this.options.noVirtualId;
};



Schema.prototype.__proto__ = EventEmitter.prototype;



Schema.prototype.paths;



Schema.prototype.tree;



Schema.prototype.add = function (obj, prefix) {
prefix = prefix || '';
for (var i in obj) {

if (!prefix && !this.tree[i])
this.tree[i] = obj[i];

if (obj[i].constructor.name == 'Object' && (!obj[i].type || obj[i].type.type)) {
if (Object.keys(obj[i]).length)
this.add(obj[i], prefix + i + '.');
else
this.path(prefix + i, obj[i]);
} else
this.path(prefix + i, obj[i]);
}
};



Schema.prototype.path = function (path, obj) {
if (obj == undefined) {
if (this.paths[path]) return this.paths[path];








var self = this
, subpaths = path.split(/\.\d+\.?/)
.filter(Boolean);

if (subpaths.length > 1) {
return subpaths.reduce(function (val, subpath) {
return val ? val.schema.path(subpath)
: self.path(subpath);
}, null);
}

return this.paths[subpaths[0]];
}

this.paths[path] = Schema.interpretAsType(path, obj);
return this;
};



Schema.interpretAsType = function (path, obj) {
if (obj.constructor.name != 'Object')
obj = { type: obj };




var type = obj.type && !obj.type.type
? obj.type
: {};

if (type.constructor.name == 'Object') {
return new Types.Mixed(path, obj);
}

if (Array.isArray(type) || type == Array) {

var cast = type == Array
? obj.cast
: type[0];

cast = cast || Types.Mixed;

if (cast instanceof Schema) {
return new Types.DocumentArray(path, cast, obj);
}
return new Types.Array(path, cast, obj);
}
return new Types[type.name](path, obj);
};



Schema.prototype.eachPath = function (fn) {
var keys = Object.keys(this.paths)
, len = keys.length;

for (var i = 0; i < len; ++i) {
fn(keys[i], this.paths[keys[i]]);
}

return this;
};



Object.defineProperty(Schema.prototype, 'requiredPaths', {
get: function () {
var paths = this.paths
, pathnames = Object.keys(paths)
, i = pathnames.length
, pathname, path
, requiredPaths = [];
while (i--) {
pathname = pathnames[i];
path = paths[pathname];
if (path.isRequired) requiredPaths.push(pathname);
}
return requiredPaths;
}
});


Schema.prototype.pathType = function (path) {
if (path in this.paths) return 'real';
if (path in this.virtuals) return 'virtual';
return 'adhocOrUndefined';
};



Schema.prototype.queue = function(name, args){
this.callQueue.push([name, args]);
return this;
};



Schema.prototype.pre = function(){
return this.queue('pre', arguments);
};



Schema.prototype.post = function(method, fn){
return this.queue('on', arguments);
};



Schema.prototype.plugin = function (fn, opts) {
fn(this, opts);
return this;
};



Schema.prototype.method = function (name, fn) {
if ('string' != typeof name)
for (var i in name)
this.methods[i] = name[i];
else
this.methods[name] = fn;
return this;
};



Schema.prototype.static = function(name, fn) {
if ('string' != typeof name)
for (var i in name)
this.statics[i] = name[i];
else
this.statics[name] = fn;
return this;
};



Schema.prototype.index = function (fields, options) {
this._indexes.push([fields, options || {}]);
return this;
};



Schema.prototype.set = function (key, value) {
if (arguments.length == 1)
return this.options[key];
this.options[key] = value;
return this;
};



Schema.prototype.__defineGetter__('indexes', function () {
var indexes = []
, seenSchemas = [];

collectIndexes(this);

return indexes;

function collectIndexes (schema, prefix) {
if (~seenSchemas.indexOf(schema)) return;
seenSchemas.push(schema);

var index;
var paths = schema.paths;
prefix = prefix || '';

for (var i in paths) {
if (paths[i]) {
if (paths[i] instanceof Types.DocumentArray) {
collectIndexes(paths[i].schema, i + '.');
} else {
index = paths[i]._index;

if (index !== false && index !== null){
var field = {};
field[prefix + i] = '2d' === index ? index : 1;
indexes.push([field, index.constructor == Object ? index : {} ]);
}
}
}
}

if (prefix) {
fixSubIndexPaths(schema, prefix);
} else {
indexes = indexes.concat(schema._indexes);
}
}



function fixSubIndexPaths (schema, prefix) {
var subindexes = schema._indexes
, len = subindexes.length
, indexObj
, newindex
, klen
, keys
, key
, i = 0
, j

for (i = 0; i < len; ++i) {
indexObj = subindexes[i][0];
keys = Object.keys(indexObj);
klen = keys.length;
newindex = {};


for (j = 0; j < klen; ++j) {
key = keys[j];
newindex[prefix + key] = indexObj[key];
}

indexes.push([newindex, subindexes[i][1]]);
}
}

});



Schema.prototype.virtual = function (name) {
var virtuals = this.virtuals || (this.virtuals = {});
var parts = name.split('.');
return virtuals[name] = parts.reduce(function (mem, part, i) {
mem[part] || (mem[part] = (i === parts.length-1)
? new VirtualType()
: {});
return mem[part];
}, this.tree);
};



Schema.prototype.virtualpath = function (name) {
return this.virtuals[name];
};

Schema.prototype.namedScope = function (name, fn) {
var namedScopes = this.namedScopes || (this.namedScopes = new NamedScope)
, newScope = Object.create(namedScopes)
, allScopes = namedScopes.scopesByName || (namedScopes.scopesByName = {});
allScopes[name] = newScope;
newScope.name = name;
newScope.block = fn;
newScope.query = new Query();
newScope.decorate(namedScopes, {
block0: function (block) {
return function () {
block.call(this.query);
return this;
};
},
blockN: function (block) {
return function () {
block.apply(this.query, arguments);
return this;
};
},
basic: function (query) {
return function () {
this.query.find(query);
return this;
};
}
});
return newScope;
};



function ObjectId () {
throw new Error('This is an abstract interface. Its only purpose is to mark '
+ 'fields as ObjectId in the schema creation.');
}



module.exports = exports = Schema;


exports.Types = Types = require('./schema/index');
NamedScope = require('./namedscope')
Query = require('./query');

exports.ObjectId = ObjectId;

