'use strict';

function Locals() {
this.cache = {};
this.getters = {};
}

Locals.prototype.get = function(name) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');

let cache = this.cache[name];

if (cache == null) {
const getter = this.getters[name];
if (!getter) return;

cache = getter();
this.cache[name] = getter();
}

return cache;
};

Locals.prototype.set = function(name, value) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');
if (value == null) throw new TypeError('value is required!');
