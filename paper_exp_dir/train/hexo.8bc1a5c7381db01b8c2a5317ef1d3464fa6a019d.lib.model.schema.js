var moment = require('moment'),
config = hexo.config,
model = hexo.model;

if (config.language) moment.lang(config.language);

var startsWith = function(str, text){
return str.substr(0, 1) === text;
};

var endsWith = function(str, text){
return str.substr(str.length - 1, 1) === text;
};

var genUrl = function(str){
return str + (endsWith(str, '/') ? '' : '/');
};

var siteUrl = genUrl(config.url),
sourceDir = hexo.source_dir,
catDir = genUrl(config.category_dir),
tagDir = genUrl(config.tag_dir),
defaultCat = config.default_category,
configLink = config.permalink;

module.exports = function(Schema){
var Post = new Schema({
id: Number,
title: String,
date: Date,
updated: Date,
categories: [Number],
tags: [Number],
comments: Boolean,
layout: {type: String, default: 'post'},
content: String,
excerpt: Number,
source: String,
slug: String,
ctime: Date,
mtime: Date
});

var Page = new Schema({
title: String,
date: Date,
updated: Date,
comments: Boolean,
layout: {type: String, default: 'page'},
content: String,
excerpt: Number,
source: String,
path: String,
ctime: Date,
mtime: Date
});

var Category = new Schema({
name: String,
slug: String,
posts: [Number]
});

var Tag = new Schema({
name: String,
slug: String,
posts: [Number]
});

var Asset = new Schema({
source: String,
mtime: Number
});

var Cache = new Schema({
source: String,
content: String,
mtime: Number
});

var dateGetter = function(){
return moment(this.date);
};

var updatedGetter = function(){
return moment(this.updated);
};

var ctimeGetter = function(){
return moment(this.ctime);
};

var mtimeGetter = function(){
return moment(this.mtime);
};

var permalinkGetter = function(){
return siteUrl + this.path;
};

var postsGetter = function(){
return model('Post')._init(this.posts);
};

var excerptGetter = function(){
return this.content.substring(0, this.excerpt);
};

var postCountGetter = function(){
return this.posts.length;
};

var fullPathGetter = function(){
return sourceDir + this.source;
};


Post.virtual('categories').get(function(){
return model('Category')._init(this.categories);
});

Post.virtual('tags').get(function(){
return model('Tag')._init(this.tags);
});

Post.virtual('date').get(dateGetter);
Post.virtual('updated').get(updatedGetter);
Post.virtual('ctime').get(ctimeGetter);
Post.virtual('mtime').get(mtimeGetter);

Post.virtual('path').get(function(){
var date = this.date,
cat = this.categories.last();

return configLink
.replace(':id', this.id || this._id)
.replace(':category', cat ? cat.slug : defaultCat)
.replace(':year', date.format('YYYY'))
.replace(':month', date.format('MM'))
.replace(':day', date.format('DD'))
.replace(':title', this.slug);
});

Post.virtual('permalink').get(permalinkGetter);
Post.virtual('excerpt').get(excerptGetter);
Post.virtual('full_path').get(fullPathGetter);


Page.virtual('date').get(dateGetter);
Page.virtual('updated').get(updatedGetter);
Page.virtual('ctime').get(ctimeGetter);
Page.virtual('mtime').get(mtimeGetter);
Page.virtual('permalink').get(permalinkGetter);
Page.virtual('excerpt').get(excerptGetter);
Page.virtual('full_path').get(fullPathGetter);


Category.virtual('path').get(function(){
return catDir + this.slug + '/';
});

Category.virtual('permalink').get(permalinkGetter);
Category.virtual('length').get(postCountGetter);
Category.virtual('posts').get(postCountGetter);


Tag.virtual('path').get(function(){
return tagDir + this.slug + '/';
});

Tag.virtual('permalink').get(permalinkGetter);
Tag.virtual('length').get(postCountGetter);
Tag.virtual('posts').get(postCountGetter);

return {
posts: Post,
pages: Page,
categories: Category,
tags: Tag,
assets: Asset,
cache: Cache
}
};
