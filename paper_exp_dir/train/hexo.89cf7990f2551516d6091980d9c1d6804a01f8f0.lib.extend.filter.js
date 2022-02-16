var async = require('async'),
domain = require('domain'),
HexoError = require('../error'),
ExtendError = HexoError.ExtendError;



var Filter = module.exports = function(){


this.store = {};
};



Filter.prototype.list = function(type){
if (type){
var store = this.store[type];
if (!store) return [];

var keys = Object.keys(store),
list = [];

keys.sort(function(a, b){
return a - b;
});

for (var i = 0, len = keys.length; i < len; i++){
list = list.concat(store[keys[i]]);
}

return list;
} else {
return this.store;
}
};

var typeAlias = {
pre: 'before_post_render',
post: 'after_post_render'
};



Filter.prototype.register = function(type, fn, priority){
if (!fn){
if (typeof type === 'function'){
fn = type;
type = 'after_post_render';
} else {
throw new ExtendError('fn is required');
}
}

type = typeAlias[type] || type;
priority = priority ? +priority : 10;

if (!this.store.hasOwnProperty(type)) this.store[type] = {};
if (!this.store[type].hasOwnProperty(priority)) this.store[type][priority] = [];

this.store[type][priority].push(fn);
};



Filter.prototype.apply = function(type, args, callback, context){
if (!args) args = [];
if (!Array.isArray(args)) args = [args];

var list = this.list(type),
d = domain.create(),
called = false;

if (typeof callback === 'function'){
var results = [];

d.on('error', function(err){
!called && callback(err);
called = true;
});

async.eachSeries(list, function(filter, next){
d.add(filter);

