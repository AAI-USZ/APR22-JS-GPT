var fs = require('graceful-fs'),
async = require('async'),
_ = require('underscore');

var Database = module.exports = function(){
this.store = {};
this.raw = {};
};

Database.prototype.collection = function(name, schema){
var store = this.store[name] = this.store[name] || new Collection(name, schema, this, this.raw[name]);
return store;
};

Database.prototype.import = function(source, callback){
var _this = this;

async.waterfall([
function(next){
if (_.isObject(source)){
next(null, source);
} else {
fs.readFile(source, function(err, content){
if (err) return callback(err);
next(null, JSON.parse(content));
});
}
},
function(content, next){
_this.raw = content;
callback.call(_this);
}
]);
};

Database.prototype.export = function(){
var result = {};

_.each(this.store, function(collection, name){
var obj = result[name] = {_: {primary: collection.primary}};
collection.each(function(item, i){
var item = obj[i] = collection.schema.save(collection.store[i]);
delete item._id;
});
});

_.each(this.raw, function(val, key){
result[key] = val;
});

return result;
};

Database.prototype.toJSON = function(){
var result = {};

_.each(this.store, function(collection, name){
result[name] = collection.toJSON();
});

return result;
};

Database.prototype.stringify = function(){
return JSON.stringify(this.toJSON());
};

var Schema = Database.prototype.Schema = function(schema){
this.schema = {};
this.virtuals = {};

for (var i in schema){
this.schema[i] = defaultType(schema[i]);
}
};

var defaultType = function(val){
var type = val.type || (val.constructor === Function ? val : val.constructor),
obj = {type: type};

if (val.default){
obj.default = val.default;
} else {
switch (type){
case String:
obj.default = '';
break;

case Date:
obj.default = Date.now;
break;

case Boolean:
obj.default = true;
break;

case Number:
obj.default = 0;
break;

case Array:
obj.default = [];
break;

case Object:
obj.default = {};
break;
}
}

switch (type){
case Array:
obj.nested = defaultType(val[0]);
break;

case Object:
var keys = Object.keys(val);
obj.nested = {};
keys.forEach(function(i){
obj.nested[i] = defaultType(val[i]);
});
break;
}

return obj;
}

var Types = Schema.Types = {
String: String,
Number: Number,
Date: Date,
Boolean: Boolean,
Array: Array,
Object: Object,
Mixed: function Mixed(){},
Reference: function Reference(collection){
this.collection = collection;
}
};

Schema.prototype.virtual = function(key){
var virtual = this.virtuals[key] = this.virtuals[key] || new Virtual(key);
return virtual;
};

var importType = function(schema, obj){
var type = schema.type;

switch (type){
case String:
obj = obj.toString();
break;

case Types.Reference:
case Number:
obj = parseInt(obj, 10);
break;

case Date:
if (_.isDate(obj)) obj = obj.getTime();
break;

case Boolean:
obj = !!obj;
break;

case Array:
if (!_.isArray(obj)) obj = _.toArray(obj);
var nestType = schema.nested.type;

for (var i=0, len=obj.length; i<len; i++){
obj[i] = importType(nestType, obj[i]);
}

break;

case Object:
var keys = Object.keys(schema);
keys.forEach(function(i){
var nestType = schema.nested[i].type;
obj[i] = importType(nestType, obj[i]);
});
break;
}

return obj;
};

Schema.prototype.save = function(obj){
_.each(this.schema, function(val, i){
var defaultVal = val.default;

if (obj.hasOwnProperty(i)){
obj[i] = importType(val, obj[i]);
} else if (defaultVal){
obj[i] = importType(val, _.isFunction(defaultVal) ? val.default() : val.default);
}
});

return obj;
};

var exportType = function(schema, obj, parent){
var type = schema.type || (schema.constructor === Function ? schema : schema.constructor);

switch (type){
case Date:
obj = new Date(obj);
break;

case Types.Reference:
try {
obj = parent.store[type.collection].store[obj];
} catch (e){
obj = null;
}
break;

case Array:
var nestType = schema.nested.type;
for (var i=0, len=obj.length; i<len; i++){
obj[i] = exportType(nestType, obj[i]);
}
break;

case Object:
var keys = Object.keys(schema);
keys.forEach(function(i){
var nestType = schema.nested[i].type;
obj[i] = exportType(nestType, obj[i]);
});
break;
}

return obj;
};

Schema.prototype.restore = function(obj, parent){
var result = {};

_.each(this.schema, function(val, i){
if (obj.hasOwnProperty(i)){
result[i] = exportType(val, obj[i], parent);
}
});

_.each(this.virtuals, function(virtual, key){
var split = key.split('.'),
cursor = result;

for (var i=0, len=split.length - 1; i<len; i++){
var item = split[i];
cursor = cursor[item] = cursor[item] || {};
}

cursor[split[i]] = virtual.getter.call(obj);
});

_.difference(Object.keys(obj), Object.keys(this.schema)).forEach(function(i){
result[i] = obj[i];
});

return result;
};

var Virtual = function(name){
this.name = name;
this.getter = function(){
return null;
};
this.setter = function(){
return null;
};
};

Virtual.prototype.get = function(fn){
this.getter = fn;
return this;
};

Virtual.prototype.set = function(fn){
this.setter = fn;
return this;
};

var Collection = function(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};


this.__defineGetter__('parent', function(){
return parent;
});

this.__defineSetter__('parent', function(item){
parent = item;
});
};

Collection.prototype.count = function(){
return this.toArray().length;
};

Collection.prototype.first = function(obj){
if (typeof obj === 'undefined'){
return this.toArray()[0];
} else {
this.store[this.first()._id] = obj;
}
};

Collection.prototype.last = function(obj){
if (typeof obj === 'undefined'){
return this.toArray()[this.count() - 1];
} else {
this.store[this.last()._id] = obj;
}
};

Collection.prototype.toArray = function(){
var arr = [];

this.each(function(item){
arr.push(item);
});

return arr;
};

Collection.prototype.toJSON = function(){
var obj = {};

this.each(function(item, i){
delete item._id;
obj[i] = item;
});

return obj;
};

Collection.prototype.stringify = function(){
return JSON.stringify(this.toJSON());
};

Collection.prototype.forEach = Collection.prototype.each = function(iterator){
for (var i in this.store){
iterator(this.get(i), i);
}

return this;
};

Collection.prototype.insert = function(obj, callback){
if (!_.isFunction(callback)) callback = function(){};

if (_.isArray(obj)){
var arr = [];
for (var i=0, len=obj.length; i<len; i++){
this.insert(obj[i], function(item){
arr.push(item);
});
}
callback.call(this, arr);
} else {
var id = this.primary++;
this.store[id] = this.schema.save(obj);
callback.call(this, this.get(id));
}

return this;
};

Collection.prototype.update = function(id, obj){
if (_.isObject(id)){
for (var i=0, len=obj.length; i<len; i++){
this.update(i, obj[i]);
}
} else {
var item = this.store[id],
newItem = _.extend(item, obj);

this.store[id] = this.schema.save(newItem);
}

return this;
};

Collection.prototype.replace = function(id, obj){
if (_.isObject(id)){
for (var i in obj){
this.replace(i, obj[i]);
}
} else {
this.store[id] = this.schema.save(obj);
}

return this;
};

Collection.prototype.get = function(id){
if (_.isArray(id)){
var arr = [];

for (var i=0, len=id.length; i<len; i++){
arr.push(this.get(id[i]));
}

return arr;
} else {
var item = this.schema.restore(this.store[id], this.parent);
item._id = id;
return item;
}
};

Collection.prototype.remove = function(id){
if (_.isArray(id)){
for (var i=0, len=id.length; i<len; i++){
delete this.store[id[i]];
}
} else {
delete this.store[id];
}

return this;
};

Collection.prototype.destroy = function(){
delete this.parent.store[this.name];
};

Collection.prototype.find = function(queries){
var obj = {};

this.each(function(item, id){
var match = true;

for (var key in queries){
var split = key.split('.'),
cursor = item;

for (var i=0, len=split.length; i<len; i++){
cursor = cursor[split[i]];
}

var query = queries[key];

if (_.isRegExp(query)){
match = !!query.exec(cursor);
} else {
match = match === cursor;
}

if (!match) break;
}

if (match) obj[id] = item;
});

return new Query(obj, this);
};

Collection.prototype.findOne = function(query){
return this.find(query).first();
};

var Query = function(store, parent){
this.store = store;


this.__defineGetter__('parent', function(){
return parent;
});

this.__defineSetter__('parent', function(item){
parent = item;
});
};

Query.prototype.forEach = Query.prototype.each = Collection.prototype.each;
Query.prototype.count = Collection.prototype.count;
Query.prototype.first = Collection.prototype.first;
Query.prototype.last = Collection.prototype.last;
Query.prototype.toArray = Collection.prototype.toArray;
Query.prototype.toJSON = Collection.prototype.toJSON;
Query.prototype.stringify = collection.prototype.stringify;

Query.prototype.get = function(id){
if (_.isArray(id)){
var arr = [];
for (var i=0, len=id.length; i<len; i++){
arr.push(this.store[id[i]]);
}
return arr;
