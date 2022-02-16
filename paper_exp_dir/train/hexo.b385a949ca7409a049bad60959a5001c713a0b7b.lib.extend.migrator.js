'use strict';

const Promise = require('bluebird');

class Migrator {
constructor() {
this.store = {};
}

list() {
return this.store;
}

get(name) {
