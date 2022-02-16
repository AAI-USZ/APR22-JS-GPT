var moment = require('moment'),
  db = hexo.db,
  Schema = db.Schema,
  config = hexo.config,
  siteUrl = config.url + '/';

var schemaPosts = new Schema({
  title: String,
  date: Date,
  updated: Date,
  categories: [new Schema.Types.Reference('categories')],
  tags: [new Schema.Types.Reference('tags')],
  comments: Boolean,
  layout: {type: String, default: 'post'},
  content: String,
  excerpt: String,
  source: String,
  path: String
});

var schemaPages = new Schema({
  title: String,
  date: Date,
  updated: Date,
  comments: Boolean,
  layout: {type: String, default: 'page'},
  content: String,
  source: String,
  path: String
});

var schemaCats = new Schema({
  name: String,
  path: String
});

var schemaTags = new Schema({
  name: String,
  path: String
});

var schemaAssets = new Schema({
  path: String,
  mtime: Date
});

var dateGetter = function(){
  return moment(this.date);
};

var updatedGetter = function(){
  return moment(this.updated);
};

var permalinkGetter = function(){
  return siteUrl + this.path;
};

var postCatGetter = function(){
  return dbPosts.find({$in: this._id});
};

var postTagGetter = function(){
  return dbPosts.find({$in: this._id});
};

schemaPosts.virtual('date').get(dateGetter);
schemaPosts.virtual('updated').get(updatedGetter);
schemaPosts.virtual('permalink').get(permalinkGetter);
schemaPages.virtual('date').get(dateGetter);
schemaPages.virtual('updated').get(updatedGetter);
schemaPages.virtual('permalink').get(permalinkGetter);
schemaCats.virtual('permalink').get(permalinkGetter);
schemaCats.virtual('posts').get(postCatGetter);
schemaTags.virtual('permalink').get(permalinkGetter);
schemaTags.virtual('posts').get(postTagGetter);

var dbPosts = exports.posts = db.collection('posts', schemaPosts),
  dbPages = exports.pages = db.collection('pages', schemaPages),
  dbCats = exports.categories = db.collection('categories', schemaCats),
  dbTags = exports.tags = db.collection('tags', schemaTags);
  dbAssets = exports.assets = db.collection('assets', schemaAssets);