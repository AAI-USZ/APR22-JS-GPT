'use strict';

const util = require('hexo-util');
const htmlTag = util.htmlTag;

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;



function linkTag(args, content) {
let url = '';
const text = [];
let external = false;
let title = '';
let i = 0;
const len = args.length;


for (; i < len; i++) {
const item = args[i];

if (rUrl.test(item)) {
url = item;
break;
} else {
