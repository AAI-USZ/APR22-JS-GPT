

var util = require('../../util'),
titlecase = util.titlecase;

var rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i,
rAuthorTitle = /([^,]+),\s*([^,]+)/,
rAuthor = /(.+)/;



module.exports = function(args, content){
