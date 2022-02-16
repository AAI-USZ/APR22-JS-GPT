

var extend = require('../../extend'),
renderSync = require('../../render').renderSync,
util = require('../../util'),
titlecase = util.titlecase;

var regex = {
fullCiteWithTitle: /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
fullCite: /(\S.*)\s+(https?:\/\/)(\S+)/i,
authorWithSource: /([^,]+),\s*([^,]+)/,
author: /(.+)/
};

var blockquote = function(args, content){
var args = args.join(' ');

if (args){
var footer = '';

if (regex.fullCiteWithTitle.test(args)){
var match = args.match(regex.fullCiteWithTitle),
author = match[1],
source = match[2] + match[3],
title = titlecase(match[4]);
} else if (regex.fullCite.test(args)){
var match = args.match(regex.fullCite),
