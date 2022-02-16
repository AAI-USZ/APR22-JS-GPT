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
for (var i in id){
this.update(i, id[i]);
}
} else {
var item = this.store[id];

_.each(obj, function(val, i){
if (item.hasOwnProperty(i) && _.isObject(val)){
var target = item[i];

if (_.isArray(target)){
_.each(val, function(prop, j){
switch (j){
case '$push':
if (_.isArray(prop)){
item[i] = target.concat(prop);
} else {
item[i].push(prop);
}
break;

case '$pull':
if (!_.isArray(prop)) prop = [prop];
item[i] = _.difference(target, prop);
break;

case '$shift':
if (prop > 0){
for (var k=0; k<prop; k++){
item[i].shift();
}
} else if (prop < 0){
for (var k=0; k<-prop; k++){
item[i].pop();
}
}
break;

case '$pop':
if (prop > 0){
for (var k=0; k<prop; k++){
item[i].pop();
}
} else if (prop < 0){
for (var k=0; k<-prop; k++){
item[i].shift();
}
}
break;
}
});
} else if (_.isNumber(target)){
_.each(val, function(prop, j){
switch (j){
case '$inc':
item[i] += prop;
break;

case '$dec':
item[i] -= prop;
break;
}
});
} else {
item[i] = val;
}
} else {
item[i] = val;
}
});

this.store[id] = this.schema.save(item);
this.emit('update', this.get(id));
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
