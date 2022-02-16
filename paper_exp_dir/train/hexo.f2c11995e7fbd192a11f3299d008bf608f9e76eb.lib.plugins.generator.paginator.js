var _ = require('lodash');

var format = function(base, i){
return base + (i == 1 ? '' : hexo.config.pagination_dir + '/' + i + '/');
};

var Paginator = function(base, posts, num, total){
var config = hexo.config,
perPage = this.per_page = config.per_page;

this.base = config.root + base;
this.total = total;
