'use strict';

class Locals {
constructor() {
this.cache = {};
this.getters = {};
}

get(name) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');

let cache = this.cache[name];
