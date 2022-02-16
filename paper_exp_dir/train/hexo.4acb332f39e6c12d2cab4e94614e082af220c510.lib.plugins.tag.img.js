'use strict';

const url = require('url');
const { htmlTag } = require('hexo-util');

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;


module.exports = ctx => {
const { config } = ctx;

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
let src, width, height, title, alt;


while (args.length > 0) {
const item = args.shift();
if (rUrl.test(item) || item[0] === '/') {
src = makeUrl(item);
break;
} else {
classes.push(item);
}
}


if (args && args.length) {
if (!/\D+/.test(args[0])) {
width = args.shift();

if (args.length && !/\D+/.test(args[0])) {
height = args.shift();
}
}
