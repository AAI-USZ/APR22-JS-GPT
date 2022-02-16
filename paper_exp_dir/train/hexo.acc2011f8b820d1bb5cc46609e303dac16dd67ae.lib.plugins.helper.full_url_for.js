'use strict';

const { parse } = require('url');

function urlForHelper(path = '/') {
if (path.startsWith('//')) {
return path;
}

const { config } = this;
const data = parse(path);


if (data.protocol) {
return path;
}


path = config.url + `/${path}`.replace(/\/{2,}/g, '/');
return path;
}

module.exports = urlForHelper;
