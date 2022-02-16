var pathFn = require('path'),
_ = require('lodash');

module.exports = function(name, options){
var viewDir = this.view_dir || this.settings.views,
path = pathFn.join(pathFn.dirname(this.filename.substring(viewDir.length)), name);

var view = hexo.theme.getView(path)
|| hexo.theme.getView(name);

