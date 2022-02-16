module.exports = function(args, callback){

if (!args._.length){
hexo.call('help', {_: ['publish']}, callback);
return;
}

hexo.post.publish({
slug: args._.pop(),
layout: args._.length ? args._[0] : hexo.config.default_layout
