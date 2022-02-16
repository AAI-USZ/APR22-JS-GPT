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
if (obj === null || obj === undefined){
obj = '';
} else {
obj = obj.toString();
}
break;

case Types.Reference:
case Number:
if (obj === null || obj === undefined){
