var _ = require('underscore');

var Database = module.exports = function(source){
this._ = {
source: source || ''
};

try {
var obj = require(source);

_.each(obj, function(val, key){
obj[key] = val;
});
} catch (err){
}
};

Database.prototype.collection = function(name){
var table = this[name];
if (!table) table = this[name] = new Collection(name, this);
return table;
};

var Collection = function(name, parent){
