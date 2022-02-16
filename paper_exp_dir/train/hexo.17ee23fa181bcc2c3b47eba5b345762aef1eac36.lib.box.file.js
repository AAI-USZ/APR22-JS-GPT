'use strict';

const { readFile, readFileSync, stat, statSync } = require('hexo-fs');

class File {
constructor({ source, path, params, type }) {
this.source = source;
this.path = path;
this.params = params;
this.type = type;
}

read(options) {
return readFile(this.source, options);
}

readSync(options) {
return readFileSync(this.source, options);
}

stat(options) {
return stat(this.source);
}

statSync(options) {
return statSync(this.source);
