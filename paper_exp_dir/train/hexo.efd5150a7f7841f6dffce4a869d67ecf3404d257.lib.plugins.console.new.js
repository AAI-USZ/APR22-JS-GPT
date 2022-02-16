var reservedKeys = ['_', 'title', 'layout', 'slug', 'path', 'replace'];

module.exports = function(args, callback){

if (!args._.length){
hexo.call('help', {_: ['new']}, callback);
return;
}

var data = {
title: args._.pop(),
