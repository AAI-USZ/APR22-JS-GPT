'use strict';

var htmlTag = require('hexo-util').htmlTag;

function imageTagHelper(path, options){

options = options || {};

var attrs = {
src: this.url_for(path)
};
