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
pre: 'beforePostRender',
post: 'afterPostRender'
};



Filter.prototype.register = function(type, fn, priority){
if (!fn){
if (typeof type === 'function'){
fn = type;
type = 'afterPostRender';
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



Filter.prototype.apply = function(type, args, callback){
if (!args) args = [];
if (!Array.isArray(args)) args = [args];

var list = this.list(type);

if (typeof callback === 'function'){
args = [].concat(args, callback);

async.eachSeries(list, function(filter, next){
filter.apply(null, args);
}, callback);
} else {
var result;

for (var i = 0, len = list.length; i < len; i++){
result = list[i].apply(null, args);
}

return result;
}
};


