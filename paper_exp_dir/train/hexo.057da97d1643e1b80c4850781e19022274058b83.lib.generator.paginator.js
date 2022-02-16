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

if (num === 1){
this.prev = 0;
this.prev_link = '';
} else if (num === 2){
this.prev = 1;
this.prev_link = base;
} else {
this.prev = num - 1;
this.prev_link = base + config.pagination_dir + '/' + (num - 1);
}

