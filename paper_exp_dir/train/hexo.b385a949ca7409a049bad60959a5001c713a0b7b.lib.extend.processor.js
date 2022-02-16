'use strict';

const Promise = require('bluebird');
const { Pattern } = require('hexo-util');

class Processor {
constructor() {
this.store = [];
}

list() {
return this.store;
}

register(pattern, fn) {
