'use strict';

const url = require('url');
const util = require('hexo-util');

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;


module.exports = ctx => {

function makeUrl(path) {
if (path[0] === '#' || path.startsWith('//')) {
return path;
}

const data = url.parse(path);

if (data && data.protocol) {
return path;
}

path = config.root + path;

return path.replace(/\/{2,}/g, '/');
}

return function imgTag(args, content) {

const classes = [];
let meta = '';
let width, height, title, alt, src;
let item = '';
let i = 0;
const len = args.length;


for (; i < len; i++) {
item = args[i];

if (rUrl.test(item)) {
src = makeUrl(item);
break;
} else {
if (item[0] === '/') {
src = makeUrl(item);
break;
} else {
classes.push(item);
}
}
}


args = args.slice(i + 1);


if (args.length) {
if (!/\D+/.test(args[0])) {
width = args.shift();

if (args.length && !/\D+/.test(args[0])) {
height = args.shift();
}
}

meta = args.join(' ');
}


if (meta && rMeta.test(meta)) {
const match = meta.match(rMeta);
title = match[1];
alt = match[2];
}

const attrs = {
src,
class: classes.join(' '),
width,
height,
title,
alt
};

return htmlTag('img', attrs);
};
};
