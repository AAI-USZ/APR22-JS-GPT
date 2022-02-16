var EventEmitter = require('events').EventEmitter,
util = require('util'),
_ = require('underscore'),
Query = require('./query');

var Collection = module.exports = function(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};
this.parent = parent;
};

util.inherits(Collection, EventEmitter);

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
var item = this.get(id);
this.emit('insert', item);
callback.call(this, item);
}

return this;
};

Collection.prototype.update = function(id, obj){
if (_.isObject(id)){
