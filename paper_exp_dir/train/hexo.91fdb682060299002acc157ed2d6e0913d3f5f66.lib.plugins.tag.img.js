'use strict';

const url = require('url');
const util = require('hexo-util');
const htmlTag = util.htmlTag;

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;


module.exports = ctx => {
const config = ctx.config;

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
let src;
let i = 0;


for (const len = args.length; i < len; i++) {
const item = args[i];

if (rUrl.test(item) || item[0] === '/') {
src = makeUrl(item);
break;
} else {
classes.push(item);
}
}


args = args.slice(i + 1);

let width, height, title, alt;


if (args.length) {
if (!/\D+/.test(args[0])) {
width = args.shift();

if (args.length && !/\D+/.test(args[0])) {
height = args.shift();
