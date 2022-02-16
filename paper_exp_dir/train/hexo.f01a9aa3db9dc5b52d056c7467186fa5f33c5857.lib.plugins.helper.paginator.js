'use strict';

function paginatorHelper(options) {
options = options || {};

var current = options.current || this.page.current || 0;
var total = options.total || this.page.total || 1;
var endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
var midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
var space = options.hasOwnProperty('space') ? options.space : '&hellip;';
var base = options.base || this.page.base || '';
var format = options.format || this.config.pagination_dir + '/%d/';
