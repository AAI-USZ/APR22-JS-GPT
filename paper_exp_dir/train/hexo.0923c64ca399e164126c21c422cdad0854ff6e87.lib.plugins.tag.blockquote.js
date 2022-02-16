

var extend = require('../../extend'),
renderSync = require('../../render').renderSync,
util = require('../../util'),
titlecase = util.titlecase;

var rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i,
rAuthorTitle = /([^,]+),\s*([^,]+)/,
rAuthor = /(.+)/;

var blockquote = function(args, content){
var args = args.join(' ');

if (args){
var footer = '';
