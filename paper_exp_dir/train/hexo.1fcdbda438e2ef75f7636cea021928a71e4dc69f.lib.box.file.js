'use strict';

const { readFile, readFileSync, stat, statSync } = require('hexo-fs');

class File {
constructor({ source, path, params, type }) {
this.source = source;
this.path = path;
this.params = params;
this.type = type;
}

read(options, callback) {
return readFile(this.source, options).asCallback(callback);
