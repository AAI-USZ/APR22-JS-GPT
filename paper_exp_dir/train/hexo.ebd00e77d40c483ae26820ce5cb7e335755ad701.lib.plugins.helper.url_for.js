'use strict';

const url = require('url');

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
return this.relative_url(this.path, path);
}


path = root + path;

return path.replace(/\/{2,}/g, '/');
}

module.exports = urlForHelper;
