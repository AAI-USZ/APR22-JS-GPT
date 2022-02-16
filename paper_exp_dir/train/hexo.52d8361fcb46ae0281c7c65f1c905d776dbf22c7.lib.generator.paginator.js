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
this.current = num;
this.current_url = num === 1 ? base : pageLink + num + '/';
this.posts = posts.slice(perPage * (num - 1), perPage * num);

this.archive = posts.archive || false;
this.year = posts.year || null;
this.month = posts.month || null;
this.category = posts.category || '';
this.tag = posts.tag || '';

if (num === 1){
this.prev = 0;
