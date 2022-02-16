var _ = require('lodash'),
Permalink = require('../../util').permalink,
permalink;

module.exports = function(data){
if (!permalink || permalink.rule !== hexo.config.permalink){
permalink = new Permalink(hexo.config.permalink);
}

var meta = {
