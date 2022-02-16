var moment = require('moment'),
path = require('path'),
url = require('url'),
util = require('../util'),
escape = util.escape;

var Schema = require('warehouse').Schema,
Moment = require('./types/moment');

var isEndWith = function(str, last){
return str[str.length - 1] === last;
};

var permalinkGetter = function(){
var url = hexo.config.url;

return url + (isEndWith(url, '/') ? '' : '/') + this.path;
};

var Post = exports.Post = new Schema({
id: Number,
title: {type: String, default: ''},
date: {type: Moment, default: moment},
updated: {type: Moment, default: moment},
categories: [{type: String, ref: 'Category'}],
tags: [{type: String, ref: 'Tag'}],
comments: {type: Boolean, default: true},
layout: {type: String, default: 'post'},
content: {type: String, default: ''},
excerpt: {type: String, default: ''},
