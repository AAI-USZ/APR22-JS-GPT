var async = require('async'),
route = require('../route'),
util = require('../util'),
file = util.file,
config = hexo.config,
root = config.root,
perPage = config.per_page,
pageDir = config.pagination_dir;

var Paginator = function(base, posts, num, total){
var pageLink = base + pageDir + '/';

this.base = root + base;
this.per_page = perPage;
this.total = total;
