hexo.locals({
posts: function(){
return model('Post').populate('categories').populate('tags');
