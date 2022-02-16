'use strict';

function paginatorHelper(options){

options = options || {};

var current = options.current || this.current || 0;
var total = options.total || this.total || 1;
var endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
var midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
