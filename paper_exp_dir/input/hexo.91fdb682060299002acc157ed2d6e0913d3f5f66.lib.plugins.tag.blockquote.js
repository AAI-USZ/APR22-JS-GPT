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
