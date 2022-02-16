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
this.current_url = this.path = num === 1 ? base : pageLink + num + '/';
this.permalink = config.url + '/' + this.path;
this.posts = posts.slice(perPage * (num - 1), perPage * num);

this.archive = posts.archive || false;
this.year = posts.year || null;
this.month = posts.month || null;
this.category = posts.category || '';
this.tag = posts.tag || '';

