var extend = require('../../extend'),
_ = require('lodash'),
moment = require('moment'),
root = hexo.config.root,
archiveDir = hexo.config.archive_dir;

var result = function(prefix, obj, options){
var defaults = {
orderby: 'name',
order: 1,
show_count: true
};
