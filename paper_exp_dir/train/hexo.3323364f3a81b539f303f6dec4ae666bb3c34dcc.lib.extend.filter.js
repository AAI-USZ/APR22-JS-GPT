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
