

var titlecase = require('titlecase');

var rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
var rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i;
var rAuthorTitle = /([^,]+),\s*([^,]+)/;
var rAuthor = /(.+)/;



module.exports = function(ctx){
return function blockquoteTag(args, content){
var str = args.join(' ');
