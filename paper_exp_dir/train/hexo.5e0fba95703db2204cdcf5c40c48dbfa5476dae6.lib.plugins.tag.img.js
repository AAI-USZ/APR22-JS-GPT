'use strict';

const { htmlTag, url_for } = require('hexo-util');

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;


module.exports = ctx => {

return function imgTag(args, content) {
const classes = [];
let src, width, height, title, alt;


while (args.length > 0) {
const item = args.shift();
if (rUrl.test(item) || item.startsWith('/')) {
src = url_for.call(ctx, item);
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

const match = rMeta.exec(args.join(' '));


if (match != null) {
title = match[1];
alt = match[2];
}
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
