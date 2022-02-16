'use strict';

var url = require('url');
var _ = require('lodash');

function urlForHelper(path, options){

path = path || '/';

var config = this.config;
var root = config.root;
var data = url.parse(path);

options = _.assign({
relative: config.relative_link
}, options);


if (data.protocol || path.substring(0, 2) === '//'){
return path;
}


if (options.relative){
return this.relative_url(this.path, path);
}


path = root + path;

return path.replace(/\/{2,}/g, '/');
}

module.exports = urlForHelper;
