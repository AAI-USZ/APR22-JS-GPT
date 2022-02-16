var Promise = require('bluebird');

function Migrator(){
this.store = {};
}

Migrator.prototype.list = function(){
return this.store;
};

Migrator.prototype.register = function(name, fn){
if (!name) throw new TypeError('name is required');
if (typeof fn !== 'function') throw new TypeError('fn must be a function');

