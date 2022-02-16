'use strict';

const { Cache } = require('hexo-util');

class Locals {
constructor() {
this.cache = new Cache();
this.getters = {};
}

get(name) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');
