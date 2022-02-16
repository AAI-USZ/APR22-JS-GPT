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
let footer = '';
let match;

if (rFullCiteWithTitle.test(str)) {
match = str.match(rFullCiteWithTitle);
