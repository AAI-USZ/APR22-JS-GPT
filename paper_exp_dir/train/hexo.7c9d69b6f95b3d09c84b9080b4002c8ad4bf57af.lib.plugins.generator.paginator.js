var route = require('../../route'),
config = hexo.config,
root = config.root,
perPage = config.per_page,
pageDir = config.pagination_dir;



var format = function(base, i){
return base + (i == 1 ? '' : pageDir + '/' + i + '/');
};

var Paginator = function(base, posts, num, total){
this.base = root + base;
this.per_page = perPage;
this.total = total;
