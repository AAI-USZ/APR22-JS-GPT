'use strict';

const url = require('url');
const _ = require('lodash');

function urlForHelper(path = '/', options) {
if (path[0] === '#' || path.startsWith('//')) {
return path;
}

const config = this.config;
const root = config.root;
const data = url.parse(path);

options = _.assign({
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
