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
