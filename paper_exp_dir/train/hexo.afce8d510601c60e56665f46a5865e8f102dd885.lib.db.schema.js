var _ = require('underscore'),
Virtual = require('./virtual');

function Schema(schema){
this.schema = {};
this.virtuals = {};

for (var i in schema){
this.schema[i] = defaultType(schema[i]);
}
};

module.exports = Schema;

var defaultType = function(val){
var type = val.type || (val.constructor === Function ? val : val.constructor),
obj = {type: type};

if (val.default){
obj.default = val.default;
} else {
