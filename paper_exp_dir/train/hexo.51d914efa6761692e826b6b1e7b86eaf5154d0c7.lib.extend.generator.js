'use strict';

const Promise = require('bluebird');

class Generator {
constructor() {
this.id = 0;
this.store = {};
}

list() {
return this.store;
}

