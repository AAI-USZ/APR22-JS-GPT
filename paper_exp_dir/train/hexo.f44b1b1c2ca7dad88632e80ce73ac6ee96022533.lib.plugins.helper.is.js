exports.is_current = function(path){
var newPath = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, newPath.length) === newPath;
};

exports.is_home = function(){
var config = this.config,
r = new RegExp('^' + config.pagination_dir + '\\/\\d+\\/');

