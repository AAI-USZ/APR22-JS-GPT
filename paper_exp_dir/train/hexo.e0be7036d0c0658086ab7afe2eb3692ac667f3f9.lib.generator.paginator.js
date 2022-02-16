var async = require('async'),
route = require('../route'),
util = require('../util'),
file = util.file,
config = hexo.config,
perPage = config.per_page,
pageDir = config.pagination_dir,
publicDir = hexo.public_dir;

var Paginator = function(base, posts, num, total){
var pageLink = base + pageDir + '/';
