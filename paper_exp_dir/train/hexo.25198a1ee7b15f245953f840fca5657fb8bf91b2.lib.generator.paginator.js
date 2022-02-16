var async = require('async'),
route = require('../route'),
util = require('../util'),
file = util.file,
config = hexo.config,
perPage = config.per_page,
pageDir = config.pagination_dir;

var Paginator = function(base, posts, num, total){
var pageLink = base + pageDir + '/';

this.per_page = perPage;
this.total = total;
this.current = num;
this.current_url = num === 1 ? base : pageLink + num + '/';
this.posts = posts.slice(perPage * (num - 1), perPage * num);
