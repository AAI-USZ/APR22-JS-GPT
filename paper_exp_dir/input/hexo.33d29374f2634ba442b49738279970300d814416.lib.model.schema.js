var moment = require('moment'),
path = require('path');

var Schema = require('warehouse').Schema,
Moment = require('./types/moment'),
Serial = require('./types/serial');

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
source: {type: String, required: true},
slug: {type: String, required: true},
raw: {type: String, default: ''}
});

Post.virtual('path', function(){
var date = this.date,
categories = this.categories,
config = hexo.config,
permalink = config.permalink;

var url = permalink
.replace(':id', this.id || this._id)
.replace(':year', date.format('YYYY'))
.replace(':month', date.format('MM'))
.replace(':day', date.format('DD'))
.replace(':title', this.slug);

if (categories.length){
var category = categories[categories.length - 1],
Category = hexo.model('Category'),
slug = Category.get(category).slug;

url = url.replace(':category', slug);
} else {
url = url.replace(':category', config.default_category);
}

return url;
});

Post.virtual('permalink', permalinkGetter);

Post.virtual('full_source', function(){
return path.join(hexo.source_dir, this.source);
});

var Page = exports.Page = new Schema({
title: {type: String, default: ''},
date: {type: Moment, default: moment},
updated: {type: Moment, default: moment},
comments: {type: Boolean, default: true},
layout: {type: String, default: 'page'},
content: {type: String, default: ''},
excerpt: {type: String, default: ''},
source: {type: String, required: true},
path: {type: String, required: true},
raw: {type: String, default: ''}
});

Page.virtual('permalink', permalinkGetter);

Page.virtual('full_source', function(){
return path.join(hexo.source_dir, this.source);
});

var Category = exports.Category = new Schema({