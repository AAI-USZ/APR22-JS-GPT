var util = require('../../util'),
escape = util.escape;

exports.is_current = function(path, strict){
if (strict){
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
} else {
path = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, path.length) === path;
}
};

exports.is_home = function(){
var config = this.config || hexo.config,
r = new RegExp('^' + escape.regex(config.pagination_dir) + '\\/\\d+\\/');

return this.path === '' || r.test(this.path);
};

exports.is_post = function(){
var config = this.config || hexo.config;

var rUrl = escape.regex(config.permalink)
.replace(':id', '\\d+')
.replace(':category', '(\\w+\\/?)+')
.replace(':year', '\\d{4}')
.replace(/:(month|day)/g, '\\d{2}')
.replace(':title', '[^\\/]+');

var r = new RegExp('^' + rUrl);

return r.test(this.path);
};
