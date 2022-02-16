var util = require('../../util'),
htmlTag = util.html_tag;

exports.link_to = function(path, text, external){
var attrs = {
href: path,
title: text || path
};

