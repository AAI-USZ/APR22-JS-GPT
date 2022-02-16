'use strict';



const titlecase = require('titlecase');

const rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
const rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i;
const rAuthorTitle = /([^,]+),\s*([^,]+)/;


const parseFooter = (args, ctx) => {
const str = args.join(' ');
if (!str) return '';

let author = '';
let source = '';
let title = '';
let match;

if ((match = rFullCiteWithTitle.exec(str))) {
author = match[1];
source = match[2] + match[3];
title = ctx.config.titlecase ? titlecase(match[4]) : match[4];
} else if ((match = rFullCite.exec(str))) {
author = match[1];
source = match[2] + match[3];
} else if ((match = rAuthorTitle.exec(str))) {
