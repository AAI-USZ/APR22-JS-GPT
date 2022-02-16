'use strict';

const url = require('url');
const relative_url = require('./relative_url');

function urlForHelper(path = '/', options) {
if (path[0] === '#' || path.startsWith('//')) {
return path;
}

const { config } = this;
const { root } = config;
const data = url.parse(path);

options = Object.assign({
relative: config.relative_link
}, options);


if (data.protocol) {
return path;
}


if (options.relative) {
return relative_url(this.path, path);
}


path = encodeURL((root + path).replace(/\/{2,}/g, '/'));

return path;
}

module.exports = urlForHelper;
