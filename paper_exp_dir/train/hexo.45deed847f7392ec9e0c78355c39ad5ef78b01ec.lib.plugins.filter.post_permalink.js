var _ = require('lodash');
var util = require('../../util');
var Permalink = util.permalink;
var permalink;

var ignoreKeys = {
path: true,
permalink: true
};

module.exports = function(data){
var config = this.config;
var meta = {
id: data.id || data._id,
title: data.slug,
year: data.date.format('YYYY'),
month: data.date.format('MM'),
day: data.date.format('DD'),
i_month: data.date.format('M'),
i_day: data.date.format('D')
};

