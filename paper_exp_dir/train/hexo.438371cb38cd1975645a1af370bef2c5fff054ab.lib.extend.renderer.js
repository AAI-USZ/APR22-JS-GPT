'use strict';

const { extname } = require('path');
const Promise = require('bluebird');

function getExtname(str) {
if (typeof str !== 'string') return '';

const ext = extname(str) || str;
return ext[0] === '.' ? ext.slice(1) : ext;
}

class Renderer {
constructor() {
this.store = {};
this.storeSync = {};
}

list(sync) {
return sync ? this.storeSync : this.store;
}

