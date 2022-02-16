'use strict';

const Promise = require('bluebird');

class Deployer {
constructor() {
this.store = {};
}

list() {
return this.store;
}

get(name) {
