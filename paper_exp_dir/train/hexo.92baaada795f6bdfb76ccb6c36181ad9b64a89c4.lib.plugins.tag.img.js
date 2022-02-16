'use strict';

var url = require('url');
var util = require('hexo-util');
var htmlTag = util.htmlTag;

var rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
var rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;


module.exports = function(ctx) {
var config = ctx.config;

function makeUrl(path) {
if (path[0] === '#' || path.substring(0, 2) === '//') {
return path;
}

var data = url.parse(path);

if (data && data.protocol) {
return path;
}

path = config.root + path;

return path.replace(/\/{2,}/g, '/');
}

return function imgTag(args, content) {

var classes = [];
var meta = '';
var width,
height,
title,
alt,
src;
var item = '';
var i = 0;
var len = args.length;


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
var match = meta.match(rMeta);
title = match[1];
alt = match[2];
}

var attrs = {
src: src,
class: classes.join(' '),
width: width,
height: height,
title: title,
alt: alt
};

return htmlTag('img', attrs);
};
};
