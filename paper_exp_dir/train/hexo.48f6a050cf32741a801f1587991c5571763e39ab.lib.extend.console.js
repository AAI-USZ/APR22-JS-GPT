'use strict';

const Promise = require('bluebird');
const abbrev = require('abbrev');



class Console {
constructor() {
this.store = {};
this.alias = {};
}


get(name) {
