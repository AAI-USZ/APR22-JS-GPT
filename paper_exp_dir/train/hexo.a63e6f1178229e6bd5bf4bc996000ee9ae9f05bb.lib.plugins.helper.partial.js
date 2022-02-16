var pathFn = require('path'),
_ = require('lodash');

module.exports = function(name, locals, options){
options = _.extend({
cache: false,
only: false
}, options);

var viewDir = this.view_dir || this.settings.views,
path = pathFn.join(pathFn.dirname(this.filename.substring(viewDir.length)), name),
view = hexo.theme.getView(path) || hexo.theme.getView(name),
self = this;

