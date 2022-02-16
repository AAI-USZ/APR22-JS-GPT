var url = require('url'),
util = require('../../util'),
escape = util.escape;

module.exports = function(data, callback){
var path = data.params.path,
source = data.source.substring(hexo.base_dir.length);

var Asset = hexo.model('Asset'),
Post = hexo.model('Post'),
