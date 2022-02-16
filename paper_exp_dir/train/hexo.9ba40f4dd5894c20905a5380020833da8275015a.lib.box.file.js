'use strict';

var fs = require('hexo-fs');

function File(data) {
this.source = data.source;
this.path = data.path;
this.params = data.params;
this.type = data.type;
}

File.prototype.read = function(options, callback) {
return fs.readFile(this.source, options).asCallback(callback);
