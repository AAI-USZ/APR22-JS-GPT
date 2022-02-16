var fs = require('hexo-fs');
var Promise = require('bluebird');

function File(data){
this.source = data.source;
this.path = data.path;
this.type = data.type;
this.params = data.params;
this.content = data.content;
}

function wrapReadOptions(options){
options = options || {};
if (typeof options === 'string') options = {encoding: options};
if (!options.hasOwnProperty('encoding')) options.encoding = 'utf8';
if (!options.hasOwnProperty('cache')) options.cache = true;

return options;
}

File.prototype.read = function(options, callback){
if (!callback && typeof options === 'function'){
callback = options;
options = {};
}
