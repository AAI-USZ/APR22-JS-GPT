'use strict';



const titlecase = require('titlecase');

const rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
const rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i;
const rAuthorTitle = /([^,]+),\s*([^,]+)/;
const rAuthor = /(.+)/;



module.exports = ctx => function blockquoteTag(args, content) {
const str = args.join(' ');
let author = '';
let source = '';
let title = '';
let footer = '';
let result = '';

if (str) {
if (rFullCiteWithTitle.test(str)) {
const match = str.match(rFullCiteWithTitle);
author = match[1];
source = match[2] + match[3];
title = ctx.config.titlecase ? titlecase(match[4]) : match[4];
} else if (rFullCite.test(str)) {
const match = str.match(rFullCite);
author = match[1];
