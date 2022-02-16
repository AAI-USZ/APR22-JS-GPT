var extend = require('../../extend'),
config = hexo.config,
archiveDir = config.archive_dir,
categoryDir = config.category_dir,
tagDir = config.tag_dir,
pageDir = config.pagination_dir,
permalink = config.permalink;

var regexPostStr = permalink
.replace(/\
.replace(':id', '\\d+')
.replace(':category', '(\\w+\\/?/)+')
.replace(':year', '\\d{4}')
.replace(/:(month|day)/g, '\\d{2}')
.replace(':title', '[^\\/]+');

var regex = {
home: new RegExp('^' + pageDir + '\\/\\d+\\/'),
post: new RegExp('^' + regexPostStr),
archive: new RegExp('^' + archiveDir + '\\/'),
year: new RegExp('^' + archiveDir + '\\/\\d{4}\\/'),
month: new RegExp('^' + archiveDir + '\\/\\d{4}\\/\\d{2}\\/'),
category: new RegExp('^' + categoryDir + '\\/'),
tag: new RegExp('^' + tagDir + '\\/')
};

extend.helper.register('is_current', function(path){
var newPath = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, newPath.length) === newPath;
});

extend.helper.register('is_home', function(){
return this.path === '' || regex.home.test(this.path);
});

extend.helper.register('is_post', function(){
