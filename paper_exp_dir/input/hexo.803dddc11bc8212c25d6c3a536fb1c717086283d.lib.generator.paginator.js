var async = require('async'),
util = require('../util'),
file = util.file;

function Paginator(base, posts, num, total){
var config = hexo.config;

this.per_page = config.per_page;
this.total = total;
this.current = num;
this.current_url = num === 1 ? base : base + config.pagination_dir + '/' + num + '/';
this.posts = posts.slice(config.per_page * (num - 1), config.per_page * num);

