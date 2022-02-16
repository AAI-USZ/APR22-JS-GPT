var moment = require('moment'),
_ = require('lodash'),
SchemaType = require('warehouse').SchemaType;

var SchemaMoment = module.exports = function(options){
SchemaType.call(this, options);
};

SchemaMoment.__proto__ = SchemaType;
SchemaMoment.prototype.__proto__ = SchemaType.prototype;

