var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var escape = util.escape;

module.exports = function(ctx){
var Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function(){
var map = ctx.config.tag_map || {};
var name = this.name;
if (!name) return;

name = map[name] || name;
return escape.filename(name, ctx.config.filename_case);
});

Tag.virtual('path').get(function(){
var tagDir = ctx.config.tag_dir;
if (tagDir[tagDir.length - 1] !== '/') tagDir += '/';

return tagDir + this.slug + '/';
});

Tag.virtual('permalink').get(function(){
return ctx.config.url + '/' + this.path;
});

Tag.virtual('posts').get(function(){
var PostTag = ctx.model('PostTag');
var Post = ctx.model('Post');

var ids = PostTag.find({tag_id: this._id}).map(function(item){
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
