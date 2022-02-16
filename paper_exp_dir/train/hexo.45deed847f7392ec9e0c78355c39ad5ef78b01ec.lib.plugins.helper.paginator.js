module.exports = function(options){
options = options || {};

var current = options.current || 0;
var total = options.total || 1;
var endSize = options.end_size || 1;
var midSize = options.mid_size || 2;
var space = options.space || '&hellip;';
var base = options.base || this.page.base;
var format = options.format || this.config.pagination_dir + '/%d/';
