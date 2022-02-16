'use strict';

var Pattern = require('hexo-util').Pattern;

exports.process = function(file){
if (file.type === 'delete'){
file.box.config = {};
return;
}

var self = this;

