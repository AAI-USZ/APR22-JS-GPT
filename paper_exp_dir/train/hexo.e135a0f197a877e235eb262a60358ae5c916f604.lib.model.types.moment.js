var moment = require('moment'),
SchemaType = require('warehouse').SchemaType;

var SchemaMoment = module.exports = function(options){
SchemaType.call(this, options);
};

SchemaMoment.__proto__ = SchemaType;
SchemaMoment.prototype.__proto__ = SchemaType.prototype;

SchemaMoment.prototype.checkRequired = function(value){
return moment.isMoment(value);
};

var cast = SchemaMoment.prototype.cast = function(value){
if (value == null || value === '') return null;
if (moment.isMoment(value)) return value;

if (hexo.config.language){
return moment(value).lang(hexo.config.language.toLowerCase());
} else {
return moment(value);
}
};

SchemaMoment.prototype.save = function(value){
return value.valueOf();
};

SchemaMoment.prototype.compare = function(vdata, alue){
return data ? data.valueOf() === cast(value).valueOf() : false;
};

SchemaMoment.prototype.q$year = function(data, value){
