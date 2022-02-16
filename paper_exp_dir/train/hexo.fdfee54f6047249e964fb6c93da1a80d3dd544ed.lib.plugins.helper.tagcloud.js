var _ = require('lodash'),
config = hexo.config,
root = config.root;

module.exports = function(tags, options){
if (!options){
options = tags;
tags = this.site.tags._createQuery();
}

