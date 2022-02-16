var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var escape = util.escape;

module.exports = function(ctx){
var Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function(){
var map = ctx.config.category_map || {};
var name = this.name;
var str = '';

if (!name) return;

if (this.parent){
var parent = ctx.model('Category').findById(this.parent);
str += parent.slug + '/';
}

name = map[name] || name;
str += escape.filename(name, ctx.config.filename_case);

return str;
});

Category.virtual('path').get(function(){
var catDir = ctx.config.category_dir;
if (catDir[catDir.length - 1] !== '/') catDir += '/';

return catDir + this.slug + '/';
});

Category.virtual('permalink').get(function(){
return ctx.config.url + '/' + this.path;
});

Category.virtual('posts').get(function(){
var PostCategory = ctx.model('PostCategory');
var Post = ctx.model('Post');

var ids = PostCategory.find({category_id: this._id}).map(function(item){
return item.post_id;
});

var query = {
_id: {$in: ids}
};

if (!ctx._showDrafts()){
query.published = true;
}

return Post.find(query);
});
