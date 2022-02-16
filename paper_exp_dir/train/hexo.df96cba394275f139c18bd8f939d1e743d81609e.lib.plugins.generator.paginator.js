var _ = require('lodash');

var config = hexo.config;

var format = function(base, i){
return base + (i == 1 ? '' : config.pagination_dir + '/' + i + '/');
};

var Paginator = function(base, posts, num, total){
var perPage = this.per_page = config.per_page;

this.base = config.root + base;
