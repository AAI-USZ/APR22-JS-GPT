var _ = require('lodash'),
Permalink = require('../../util').permalink,
permalink;

module.exports = function(data){
var config = hexo.config;

if (!permalink || permalink.rule !== config.permalink){
permalink = new Permalink(config.permalink);
}

var meta = {
id: data.id || data._id,
title: data.slug,
year: data.date.format('YYYY'),
