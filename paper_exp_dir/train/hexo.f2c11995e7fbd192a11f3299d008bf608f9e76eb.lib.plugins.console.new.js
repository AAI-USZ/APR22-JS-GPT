module.exports = function(args, callback){

if (!args._.length){
hexo.call('help', {_: ['new']}, callback);
return;
}

hexo.post.create({
title: args._.pop(),
layout: args._.length ? args._[0] : hexo.config.default_layout
}, function(err, target){
if (err) return callback(err);
