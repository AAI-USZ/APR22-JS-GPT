'use strict';



const { escapeHTML, highlight, prismHighlight } = require('hexo-util');

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/\S+)/i;
const rCaption = /\S[\S\s]*/;



function parseArgs(args) {
const _else = [];
const len = args.length;
let lang,
line_number, wrap;
let firstLine = 1;
const mark = [];
for (let i = 0; i < len; i++) {
const colon = args[i].indexOf(':');

if (colon === -1) {
_else.push(args[i]);
continue;
}

const key = args[i].slice(0, colon);
const value = args[i].slice(colon + 1);

switch (key) {
case 'lang':
lang = value;
break;
case 'line_number':
line_number = value === 'true';
break;
case 'first_line':
if (!isNaN(value)) firstLine = +value;
break;
case 'wrap':
wrap = value === 'true';
break;
case 'mark': {
for (const cur of value.split(',')) {
const hyphen = cur.indexOf('-');
if (hyphen !== -1) {
let a = +cur.substr(0, hyphen);
let b = +cur.substr(hyphen + 1);
if (Number.isNaN(a) || Number.isNaN(b)) continue;
if (b < a) {
const temp = a;
a = b;
b = temp;
}

for (; a <= b; a++) {
mark.push(a);
}
}
if (!isNaN(cur)) mark.push(+cur);
}
break;
}
default: {
_else.push(args[i]);
}
}
}

const arg = _else.join(' ');

let match, caption = '';

if ((match = arg.match(rCaptionUrlTitle)) != null) {
caption = `<span>${match[1]}</span><a href="${match[2]}">${match[3]}</a>`;
} else if ((match = arg.match(rCaptionUrl)) != null) {
