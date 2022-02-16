var async = require('async'),
ExtendError = require('../error').ExtendError;



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
throw new ExtendError('Filter function is not defined');
}
}

type = typeAlias[type] || type;
priority = priority ? +priority : 10;

if (!this.store.hasOwnProperty(type)) this.store[type] = {};
if (!this.store[type].hasOwnProperty(priority)) this.store[type][priority] = [];

this.store[type][priority].push(fn);
};
