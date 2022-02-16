var _ = require('underscore'),
Virtual = require('./virtual');

var Schema = module.exports = function(schema){
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

case Types.Reference:
obj.collection = val.collection;
break;
}
}

switch (type){
case Array:
obj.nested = val[0] ? defaultType(val[0]) : {type: Types.Mixed};
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
if (obj == null || typeof obj === 'undefined'){
obj = '';
} else {
obj = obj.toString();
}
break;

case Types.Reference:
case Number:
if (obj == null || typeof obj === 'undefined'){
obj = 0;
} else {
obj = parseInt(obj, 10);
}
break;

case Date:
if (_.isDate(obj)){
obj = obj.getTime();
} else {
obj = new Date().getTime();
}
break;

case Boolean:
obj = !!obj;
break;

case Array:
if (!_.isArray(obj)) obj = _.toArray(obj);
var nestType = schema.nested;

for (var i=0, len=obj.length; i<len; i++){
obj[i] = importType(nestType, obj[i]);
}

break;

case Object:
for (var i in schema.nested){
obj[i] = importType(schema.nested[i], obj[i]);
}
break;
}

return obj;
};

Schema.prototype.save = function(obj){
var obj = _.clone(obj),
_schema = this.schema;

_.each(this.schema, function(val, i){
var defaultVal = val.default;

if (obj.hasOwnProperty(i)){
obj[i] = importType(val, obj[i]);
} else if (defaultVal != null && typeof defaultVal !== 'undefined'){
obj[i] = importType(val, _.isFunction(defaultVal) ? val.default() : val.default);
