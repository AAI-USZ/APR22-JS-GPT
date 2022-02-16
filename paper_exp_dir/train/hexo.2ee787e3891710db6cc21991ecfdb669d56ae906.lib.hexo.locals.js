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

cache = this.cache[name] = getter();
}

return cache;
};

Locals.prototype.set = function(name, value) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');
if (value == null) throw new TypeError('value is required!');

let getter;

if (typeof value === 'function') {
getter = value;
} else {
getter = () => value;
}

this.getters[name] = getter;
this.cache[name] = null;

return this;
