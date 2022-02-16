var Promise = require('bluebird');

var typeAlias = {
pre: 'before_post_render',
post: 'after_post_render'
};

function Filter(){
this.store = {};
}

Filter.prototype.list = function(type){
if (!type) return this.store;
return this.store[type] || [];
};

Filter.prototype.register = function(type, fn, priority){
if (!priority){
if (typeof type === 'function'){
priority = fn;
fn = type;
type = 'after_post_render';
}
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');

type = typeAlias[type] || type;
priority = priority == null ? 10 : priority;

var store = this.store[type] = this.store[type] || [];

fn.priority = priority;
store.push(fn);

store.sort(function(a, b){
return a.priority - b.priority;
});
};

Filter.prototype.unregister = function(type, fn){
if (!type) throw new TypeError('type is required');
if (typeof fn !== 'function') throw new TypeError('fn must be a function');

var list = this.list(type);
if (!list || !list.length) return;

for (var i = 0, len = list.length; i < len; i++){
if (list[i] === fn){
list.splice(i, 1);
break;
