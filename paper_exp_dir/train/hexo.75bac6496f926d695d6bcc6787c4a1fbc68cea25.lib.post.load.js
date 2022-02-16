var _ = require('lodash'),
async = require('async');



module.exports = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
watch: false
}, options);

var isReady = false;

async.auto({
load_theme: function(next){
hexo.theme.load(next);
},
watch_theme: ['load_theme', function(next){
if (options.watch){
hexo.theme.watch();

hexo.on('processAfter', function(path){
if (isReady && path === hexo.theme_dir){
hexo.theme.generate(options);
}
});
}

