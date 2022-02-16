module.exports = function(options){
options = options || {};

var current = options.current || this.current || 0;
var total = options.total || this.total || 1;
var endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
var midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
var space = options.hasOwnProperty('space') ? options.space : '&hellip;';
var base = options.base || this.page.base || '';
var format = options.format || this.config.pagination_dir + '/%d/';
var prevText = options.prev_text || 'Prev';
var nextText = options.next_text || 'Next';
var prevNext = options.hasOwnProperty('prev_next') ? options.prev_next : true;
var transform = options.transform;
var self = this;
var result = '';
var i;

var currentPage = '<span class="page-number current">' +
