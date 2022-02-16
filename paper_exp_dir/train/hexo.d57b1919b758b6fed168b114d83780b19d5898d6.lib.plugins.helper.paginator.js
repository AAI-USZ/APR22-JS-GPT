var extend = require('../../extend'),
_ = require('lodash'),
config = hexo.config,
root = config.root,
paginationDir = config.pagination_dir;

extend.helper.register('paginator', function(options){
var options = _.extend({
base: root,
format: paginationDir + '/%d/',
total: this.total ? 1,
current: this.current ? 0,
